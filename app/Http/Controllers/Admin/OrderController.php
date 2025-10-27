<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\OrderService;
use App\Services\OptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf as PDF;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer' => [
                        'name' => $order->user ? $order->user->name : ($order->shipping_address['full_name'] ?? 'Guest'),
                        'email' => $order->user ? $order->user->email : ($order->shipping_address['email'] ?? 'N/A'),
                        'phone' => $order->user ? $order->user->phone : ($order->shipping_address['phone'] ?? 'N/A')
                    ],
                    'date' => $order->created_at->format('Y-m-d'),
                    'status' => $order->status ?? 'pending',
                    'total' => (float) $order->total,
                    'items_count' => $order->items->sum('quantity'),
                    'payment_method' => ucfirst($order->payment_method),
                    'shipping_address' => $order->shipping_address ? [
                        'full_name' => $order->shipping_address['full_name'],
                        'phone' => $order->shipping_address['phone'],
                        'email' => $order->shipping_address['email'],
                        'address_line' => $order->shipping_address['address_line'],
                        'area' => $order->shipping_address['area']
                    ] : null
                ];
            });

        return Inertia::render('Admin/Orders/List', [
            'orders' => $orders,
            'flash' => session('flash')
        ]);
    }

    public function create()
    {
        $data = OrderService::getCreatePageData();

        return Inertia::render('Admin/Orders/CreateOrder', $data);
    }

    public function store(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'user_id' => 'nullable|integer|exists:users,id',
                'shipping_address' => 'required|array',
                'shipping_address.full_name' => 'required|string|max:255',
                'shipping_address.phone' => 'required|string|max:32',
                'shipping_address.email' => 'required|email|max:255',
                'shipping_address.address_line' => 'required|string|max:500',
                'shipping_address.area' => 'required|string|in:inside_dhaka,outside_dhaka',
                'billing_address' => 'required|array',
                'billing_address.full_name' => 'required|string|max:255',
                'billing_address.phone' => 'required|string|max:32',
                'billing_address.email' => 'required|email|max:255',
                'billing_address.address_line' => 'required|string|max:500',
                'billing_address.area' => 'required|string|in:inside_dhaka,outside_dhaka',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|integer|exists:products,id',
                'items.*.variant_id' => 'required|integer|exists:product_variants,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
                'payment_method' => 'required|string|in:cod,card,bkash,nagad,rocket',
                'shipping_method' => 'required|string|in:standard,free',
                'notes' => 'nullable|string|max:1000',
                'discount_code' => 'nullable|string|max:50',
                'discount_amount' => 'nullable|numeric|min:0',
                'send_confirmation_email' => 'boolean',
                'send_invoice' => 'boolean',
                'subtotal' => 'required|numeric|min:0',
                'shipping_cost' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
            ]);


            // Use database transaction for data consistency
            return DB::transaction(function () use ($validated) {
                // Create the order using OrderService
                $order = OrderService::createOrder($validated);

                // Send order notifications
                OrderService::sendOrderNotifications($order, $validated);

                return redirect()->route('admin.orders.index')->with('success', 'Order created successfully');
            });

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Order creation failed: ' . $e->getMessage())->withInput();
        }
    }

    public function show($id)
    {
        $order = Order::with([
            'user.addresses',
            'items.product.images',
            'items.variant'
        ])->find($id);

        if (!$order) {
            abort(404, 'Order not found');
        }

        return Inertia::render('Admin/Orders/ViewOrder', [
            'order' => $order
        ]);
    }

    public function changeOrderStatus(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:orders,id',
            'status' => 'required|string|in:pending,confirmed,shipped,delivered,cancelled'
        ]);

        $order = Order::find($validated['id']);
        $order->status = $validated['status'];
        $order->save();

        return redirect()->back()->with('success', 'Order status changed successfully');
    }

    public function cancelOrder(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:orders,id'
        ]);

        $order = Order::find($validated['id']);
        $order->status = 'cancelled';
        $order->save();

        return redirect()->back()->with('success', 'Order cancelled successfully');
    }

    // Download invoice
    public function downloadInvoice($id)
    {
        $order = Order::with(['user.addresses', 'items.product', 'items.variant'])
            ->find($id);

        if (!$order) {
            abort(404, 'Order not found');
        }

        // Generate PDF invoice using DomPDF
        $pdf = PDF::loadView('invoices.order', [
            'order' => $order,
        ]);

        // Set PDF options for better compatibility
        $pdf->setPaper('A4', 'portrait');
        $pdf->setOptions([
            'isHtml5ParserEnabled' => true,
            'isRemoteEnabled' => false,
            'defaultFont' => 'Arial',
            'isPhpEnabled' => false,
            'isFontSubsettingEnabled' => false,
            'isUnicode' => false,
            'debugKeepTemp' => false,
            'debugCss' => false,
            'debugLayout' => false,
            'debugLayoutLines' => false,
            'debugLayoutBlocks' => false,
            'debugLayoutInline' => false,
            'debugLayoutPaddingBox' => false,
            'defaultMediaType' => 'print',
            'isJavascriptEnabled' => false,
            'isFontCacheEnabled' => true
        ]);

        return $pdf->download('invoice-' . $order->order_number . '.pdf');
    }

}
