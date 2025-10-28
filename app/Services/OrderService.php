<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Address;
use App\Models\Product;
use App\Models\User;
use App\Models\ProductVariant;
use App\Services\OptionService;

class OrderService
{
    /**
     * Get data for the create order page
     */
    public static function getCreatePageData(): array
    {
        // Fetch products with their variants and images
        $products = Product::with(['variants.images', 'images', 'categories'])
            ->where('status', 'active')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'image' => $product->images->first()
                        ? asset('storage/' . $product->images->first()->image_path)
                        : '/placeholder.svg?height=60&width=60',
                    'category' => $product->categories->first() ? $product->categories->first()->name : 'Uncategorized',
                    'sku' => $product->sku,
                    'lowStockThreshold' => 10, // You can make this configurable
                    'variants' => $product->variants->map(function ($variant) {
                        return [
                            'id' => $variant->id,
                            'sku' => $variant->sku,
                            'title' => $variant->title,
                            'size' => $variant->size,
                            'color' => $variant->color,
                            'material' => $variant->material,
                            'price' => (float) $variant->price, // Selling price
                            'compare_at_price' => $variant->compare_at_price ? (float) $variant->compare_at_price : null, // Regular price
                            'quantity' => (int) $variant->quantity,
                            'status' => $variant->status,
                            'image' => $variant->images->first()
                                ? asset('storage/' . $variant->images->first()->image_path)
                                : null, // Variant-specific image
                        ];
                    }),
                ];
            });

        // Fetch customers (users with role 'customer')
        $customers = User::with(['addresses'])
            ->where('role', 'customer')
            ->get()
            ->map(function ($user) {
                // Calculate total orders and spent amount
                $totalOrders = $user->orders()->count();
                $totalSpent = $user->orders()->sum('total');
                $lastOrder = $user->orders()->latest()->first();

                // Get default address
                $defaultAddress = $user->addresses()->where('is_default', true)->first();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'personal_phone' => $user->phone,
                    'phone' => $defaultAddress ? $defaultAddress->phone : '',
                    'address' => $defaultAddress ? $defaultAddress->address_line : '',
                    'totalOrders' => $totalOrders,
                    'totalSpent' => $totalSpent,
                    'lastOrderDate' => $lastOrder ? $lastOrder->created_at->format('Y-m-d') : null,
                    'defaultShippingAddress' => $defaultAddress ? [
                        'address_line' => $defaultAddress->address_line,
                        'area' => $defaultAddress->area,
                    ] : null,
                    'addresses' => $user->addresses->map(function ($address) {
                        return [
                            'id' => $address->id,
                            'full_name' => $address->full_name,
                            'address_line' => $address->address_line,
                            'area' => $address->area,
                            'isDefault' => $address->is_default,
                        ];
                    }),
                ];
            });

        // Get shipping costs from options
        $shippingSettings = OptionService::getShippingSettings();
        $shippingCosts = [
            'inside_dhaka' => [
                'standard' => $shippingSettings['inside_dhaka']['standard'] ?? 10.00,
                'free' => 0
            ],
            'outside_dhaka' => [
                'standard' => $shippingSettings['outside_dhaka']['standard'] ?? 25.00,
                'free' => 0
            ]
        ];

        return [
            'products' => $products,
            'customers' => $customers,
            'shippingCosts' => $shippingCosts,
        ];
    }

    /**
     * Create a new order with all related data
     */
    public static function createOrder(array $validated): Order
    {
        // Get user ID (can be null for guest customers)
        $userId = $validated['user_id'] ?? null;

        // Create the order
        $order = self::createOrderRecord($validated, $userId);

        // Create order items
        self::createOrderItems($order, $validated['items']);

        // Update product stock
        self::updateProductStock($validated['items']);

        return $order;
    }




    /**
     * Create order record
     */
    private static function createOrderRecord(array $validated, ?int $userId): Order
    {
        $orderData = [
            'user_id' => $userId,
            'shipping_address' => $validated['shipping_address'],
            'billing_address' => $validated['billing_address'],
            'status' => 'pending',
            'subtotal' => $validated['subtotal'],
            'shipping_cost' => $validated['shipping_cost'],
            'discount_total' => $validated['discount_total'] ?? 0,
            'tax_total' => $validated['tax_total'] ?? 0,
            'total' => $validated['total'],
            'payment_method' => $validated['payment_method'],
            'shipping_method' => $validated['shipping_method'],
            'payment_status' => 'unpaid',
            'notes' => $validated['notes'] ?? null,
        ];

        return Order::create($orderData);
    }

    /**
     * Create order items
     */
    private static function createOrderItems(Order $order, array $items): void
    {
        foreach ($items as $item) {
            // Handle both 'price' (create) and 'unit_price' (update) field names
            $unitPrice = $item['unit_price'] ?? $item['price'];

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'product_variant_id' => $item['variant_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $unitPrice,
                'total_price' => $unitPrice * $item['quantity'],
            ]);
        }
    }

    /**
     * Update product stock
     */
    private static function updateProductStock(array $items): void
    {
        foreach ($items as $item) {
            ProductVariant::where('id', $item['variant_id'])
                ->decrement('quantity', $item['quantity']);
        }
    }

    /**
     * Update an existing order with all related data
     */
    public static function updateOrder(array $validated): Order
    {
        $order = Order::find($validated['order_id']);

        if (!$order) {
            throw new \Exception('Order not found');
        }

        // Store original items for stock adjustment
        $originalItems = $order->items->toArray();

        // Update the order record
        self::updateOrderRecord($order, $validated);

        // Update order items
        self::updateOrderItems($order, $validated['items']);

        // Adjust product stock based on changes
        self::adjustProductStock($originalItems, $validated['items']);

        return $order;
    }

    /**
     * Update order record
     */
    private static function updateOrderRecord(Order $order, array $validated): void
    {
        $order->update([
            'user_id' => $validated['user_id'],
            'shipping_address' => $validated['shipping_address'],
            'billing_address' => $validated['billing_address'],
            'status' => $validated['status'],
            'subtotal' => $validated['subtotal'],
            'shipping_cost' => $validated['shipping_cost'],
            'discount_total' => $validated['discount_total'],
            'tax_total' => $validated['tax_total'],
            'total' => $validated['total'],
            'payment_method' => $validated['payment_method'],
            'shipping_method' => $validated['shipping_method'],
            'notes' => $validated['notes'],
        ]);
    }

    /**
     * Update order items
     */
    private static function updateOrderItems(Order $order, array $items): void
    {
        // Get existing item IDs (only non-null IDs)
        $existingItemIds = collect($items)->pluck('id')->filter(function($id) {
            return $id !== null && $id !== '';
        })->toArray();

        // Delete items that are no longer in the order
        if (!empty($existingItemIds)) {
            $order->items()->whereNotIn('id', $existingItemIds)->delete();
        } else {
            // If no existing items, delete all current items
            $order->items()->delete();
        }

        // Update or create items
        foreach ($items as $item) {
            if ($item['id'] && $item['id'] !== null && $item['id'] !== '') {
                // Update existing item
                OrderItem::where('id', $item['id'])->update([
                    'product_id' => $item['product_id'],
                    'product_variant_id' => $item['variant_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['unit_price'] * $item['quantity'],
                ]);
            } else {
                // Create new item
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_variant_id' => $item['variant_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'total_price' => $item['unit_price'] * $item['quantity'],
                ]);
            }
        }
    }

    /**
     * Adjust product stock based on order changes
     */
    private static function adjustProductStock(array $originalItems, array $newItems): void
    {
        // Create maps for easier comparison
        $originalMap = collect($originalItems)->keyBy('product_variant_id');
        $newMap = collect($newItems)->keyBy('variant_id');

        // Get all variant IDs that were affected
        $allVariantIds = collect($originalItems)->pluck('product_variant_id')
            ->merge(collect($newItems)->pluck('variant_id'))
            ->unique();

        foreach ($allVariantIds as $variantId) {
            $originalQuantity = $originalMap->get($variantId)['quantity'] ?? 0;
            $newQuantity = $newMap->get($variantId)['quantity'] ?? 0;

            $quantityDifference = $newQuantity - $originalQuantity;

            if ($quantityDifference !== 0) {
                if ($quantityDifference > 0) {
                    // Stock decreased (more items ordered)
                    ProductVariant::where('id', $variantId)
                        ->decrement('quantity', $quantityDifference);
                } else {
                    // Stock increased (fewer items ordered)
                    ProductVariant::where('id', $variantId)
                        ->increment('quantity', abs($quantityDifference));
                }
            }
        }
    }

    /**
     * Send order notifications
     */
    public static function sendOrderNotifications(Order $order, array $validated): void
    {
        // TODO: Implement email notifications
        // - Send confirmation email to customer
        // - Send notification to admin
        // - Send invoice if requested

        if ($validated['send_confirmation_email'] ?? false) {
            // TODO: Send order confirmation email
        }

        if ($validated['send_invoice'] ?? false) {
            // TODO: Send invoice email
        }
    }
}
