<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderRequest;
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

    public function store(OrderRequest $request)
    {
        try {
            $validated = $request->validated();


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

    public function edit($id)
    {
        $order = Order::with([
            'user.addresses',
            'items.product.images',
            'items.variant'
        ])->find($id);

        if (!$order) {
            abort(404, 'Order not found');
        }

        $data = OrderService::getCreatePageData();
        $data['order'] = $order;
        // dd($data);

        return Inertia::render('Admin/Orders/Edit', $data);
    }

    public function update(OrderRequest $request)
    {
        try {
            $validated = $request->validated();

            // Use database transaction for data consistency
            return DB::transaction(function () use ($validated) {
                // Update the order using OrderService
                $order = OrderService::updateOrder($validated);

                return redirect()->route('admin.orders.show', $order->id)->with('success', 'Order updated successfully');
            });

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Order update failed: ' . $e->getMessage())->withInput();
        }
    }

    public function changeOrderStatus(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:orders,id',
            'status' => 'required|string|in:pending,confirmed,shipped,delivered,cancelled'
        ]);

        $order = Order::find($validated['id']);

        if (!$order) {
            return redirect()->back()->with('error', 'Order not found');
        }

        $previousStatus = $order->status;
        $newStatus = $validated['status'];

        DB::transaction(function () use ($order, $previousStatus, $newStatus) {
            $order->status = $newStatus;
            $order->save();

            if ($previousStatus !== 'cancelled' && $newStatus === 'cancelled') {
                OrderService::restoreStockForOrder($order);
            } elseif ($previousStatus === 'cancelled' && $newStatus !== 'cancelled') {
                OrderService::deductStockForOrder($order);
            }
        });

        return redirect()->back()->with('success', 'Order status changed successfully');
    }

    public function cancelOrder(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|integer|exists:orders,id'
        ]);

        $order = Order::find($validated['id']);

        if (!$order) {
            return redirect()->back()->with('error', 'Order not found');
        }

        if ($order->status === 'cancelled') {
            return redirect()->back()->with('success', 'Order already cancelled');
        }

        DB::transaction(function () use ($order) {
            OrderService::restoreStockForOrder($order);
            $order->status = 'cancelled';
            $order->save();
        });

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
