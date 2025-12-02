<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        $statusGroups = [
            'new' => ['pending', 'confirmed', 'shipped'],
            'history' => ['delivered', 'cancelled'],
        ];

        $orders = $user->orders()
            ->with(['items.product.images', 'items.variant'])
            ->latest()
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'orderNumber' => $order->order_number,
                    'status' => $order->status,
                    'total' => (float) $order->total,
                    'createdAt' => optional($order->created_at)->toIso8601String(),
                    'shippingAddress' => $order->shipping_address,
                    'paymentMethod' => $order->payment_method,
                    'items' => $order->items->map(function ($item) {
                        $variant = $item->variant;
                        $product = $item->product ?? $variant?->product;
                        $image = $product?->primary_image_url;

                        return [
                            'id' => $item->id,
                            'name' => $product?->name ?? $variant?->title ?? $variant?->sku ?? 'Product',
                            'quantity' => (int) $item->quantity,
                            'unitPrice' => (float) ($item->unit_price ?? 0),
                            'totalPrice' => (float) ($item->total_price ?? ($item->unit_price * $item->quantity)),
                            'image' => $image,
                        ];
                    })->values(),
                ];
            });

        return Inertia::render('Customer/Orders', [
            'orders' => $orders,
            'statusGroups' => $statusGroups,
        ]);
    }

    public function show(Request $request, string $orderNumber): Response
    {
        $user = $request->user();

        $order = $user->orders()
            ->where('order_number', $orderNumber)
            ->with(['items.product.images', 'items.variant'])
            ->firstOrFail();

        $orderData = [
            'id' => $order->id,
            'orderNumber' => $order->order_number,
            'status' => $order->status,
            'createdAt' => optional($order->created_at)->toIso8601String(),
            'subtotal' => (float) $order->subtotal,
            'shippingCost' => (float) $order->shipping_cost,
            'discountTotal' => (float) $order->discount_total,
            'taxTotal' => (float) $order->tax_total,
            'total' => (float) $order->total,
            'shippingAddress' => $order->shipping_address,
            'billingAddress' => $order->billing_address,
            'paymentMethod' => $order->payment_method,
            'paymentStatus' => $order->payment_status,
            'items' => $order->items->map(function ($item) {
                $variant = $item->variant;
                $product = $item->product ?? $variant?->product;
                $image = $product?->primary_image_url;

                return [
                    'id' => $item->id,
                    'name' => $product?->name ?? $variant?->title ?? $variant?->sku ?? 'Product',
                    'variant' => $variant ? [
                        'color' => $variant->color,
                        'size' => $variant->size,
                        'material' => $variant->material,
                    ] : null,
                    'quantity' => (int) $item->quantity,
                    'unitPrice' => (float) ($item->unit_price ?? 0),
                    'totalPrice' => (float) ($item->total_price ?? ($item->unit_price * $item->quantity)),
                    'image' => $image,
                ];
            })->values(),
        ];

        return Inertia::render('Customer/ShowOrder', [
            'order' => $orderData,
        ]);
    }
}


