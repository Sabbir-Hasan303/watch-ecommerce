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
        $orders = Order::with(['user', 'items.product', 'shippingAddress'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'customer' => [
                        'name' => $order->user ? $order->user->name : ($order->guest_info['name'] ?? 'Guest'),
                        'email' => $order->user ? $order->user->email : ($order->guest_info['email'] ?? 'N/A'),
                        'phone' => $order->user ? $order->user->phone : ($order->guest_info['phone'] ?? 'N/A')
                    ],
                    'date' => $order->created_at->format('Y-m-d'),
                    'status' => $order->status ?? 'pending',
                    'total' => (float) $order->total,
                    'items_count' => $order->items->sum('quantity'),
                    'payment_method' => ucfirst($order->payment_method),
                    'shipping_address' => $order->shippingAddress ? [
                        'full_name' => $order->shippingAddress->full_name,
                        'phone' => $order->shippingAddress->phone,
                        'address_line' => $order->shippingAddress->address_line,
                        'area' => $order->shippingAddress->area
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
                'customer_id' => 'nullable|integer',
                'is_guest' => 'required|boolean',
                'guest_details' => 'nullable|array',
                'selected_address_id' => 'nullable|integer|exists:addresses,id',
                'is_new_address' => 'required|boolean',
                'shipping_address' => 'required|array',
                'shipping_address.full_name' => 'required|string|max:255',
                'shipping_address.phone' => 'required|string|max:32',
                'shipping_address.address_line' => 'required|string|max:500',
                'shipping_address.area' => 'required|string|in:inside_dhaka,outside_dhaka',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|integer|exists:products,id',
                'items.*.variant_id' => 'required|integer|exists:product_variants,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
                'payment_method' => 'required|string|in:cod,card,bkash,nagad,rocket',
                'shipping_method' => 'required|string|in:standard,free',
                'order_notes' => 'nullable|string|max:1000',
                'discount_code' => 'nullable|string|max:50',
                'discount_amount' => 'nullable|numeric|min:0',
                'send_confirmation_email' => 'boolean',
                'send_invoice' => 'boolean',
                'subtotal' => 'required|numeric|min:0',
                // 'shipping_cost' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
            ]);

            // Additional validation for customer logic
            if (!$validated['is_guest'] && !$validated['customer_id']) {
                throw new \Illuminate\Validation\ValidationException(
                    validator([], []),
                    ['customer_id' => ['Customer ID is required for registered customers.']]
                );
            }

            if (!$validated['is_guest'] && $validated['customer_id'] && !User::where('id', $validated['customer_id'])->exists()) {
                throw new \Illuminate\Validation\ValidationException(
                    validator([], []),
                    ['customer_id' => ['The selected customer does not exist.']]
                );
            }

            if ($validated['is_guest'] && $validated['customer_id']) {
                throw new \Illuminate\Validation\ValidationException(
                    validator([], []),
                    ['customer_id' => ['Customer ID should be null for guest customers.']]
                );
            }

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
            'user',
            'items.product.images',
            'items.variant',
            'shippingAddress',
            'billingAddress'
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
        $order = Order::with(['user', 'items.product', 'items.variant', 'shippingAddress', 'billingAddress'])
            ->find($id);

        if (!$order) {
            abort(404, 'Order not found');
        }

        // Generate PDF invoice using DomPDF
        $pdf = PDF::loadView('invoices.order', [
            'order' => $order,
            'customer' => $order->user ? $order->user : (object) $order->guest_info
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
