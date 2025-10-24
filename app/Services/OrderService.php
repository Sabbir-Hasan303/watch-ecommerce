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
        // Handle customer and address logic
        $customerId = $validated['customer_id'];
        $shippingAddressId = $validated['selected_address_id'];

        // Create new address if needed
        if ($validated['is_new_address'] && $validated['customer_id'] != null) {
            $shippingAddressId = self::createShippingAddress($validated['shipping_address'], $customerId);
        }

        // Calculate totals with dynamic tax
        $totals = self::calculateTotals($validated);

        // Create the order
        $order = self::createOrderRecord($validated, $customerId, $shippingAddressId, $totals);

        // Create order items
        self::createOrderItems($order, $validated['items']);

        // Update product stock
        self::updateProductStock($validated['items']);

        return $order;
    }

    /**
     * Calculate order totals with dynamic tax and shipping
     */
    public static function calculateTotals(array $validated): array
    {
        $subtotal = $validated['subtotal'];
        $discountAmount = $validated['discount_amount'] ?? 0;

        // Calculate shipping cost from options
        $shippingCost = self::calculateShippingCost($validated);

        // Calculate tax based on options
        $taxAmount = 0;
        if (OptionService::isTaxEnabled()) {
            $taxAmount = OptionService::calculateTax($subtotal - $discountAmount);
        }

        $total = $subtotal - $discountAmount + $shippingCost + $taxAmount;

        return [
            'subtotal' => $subtotal,
            'shipping_cost' => $shippingCost,
            'discount_total' => $discountAmount,
            'tax_total' => $taxAmount,
            'total' => $total
        ];
    }

    /**
     * Calculate shipping cost from options
     */
    private static function calculateShippingCost(array $validated): float
    {
        $shippingMethod = $validated['shipping_method'] ?? 'standard';

        // If free shipping, return 0
        if ($shippingMethod === 'free') {
            return 0.0;
        }

        // For standard shipping, get cost from options
        $shippingSettings = OptionService::getShippingSettings();
        $area = $validated['shipping_address']['area'] ?? 'inside_dhaka';

        // Get shipping cost from options for standard shipping
        if (isset($shippingSettings[$area]['standard'])) {
            return (float) $shippingSettings[$area]['standard'];
        }

        // Fallback to default cost if not found in options
        return 10.0;
    }

    /**
     * Create shipping address
     */
    private static function createShippingAddress(array $addressData, ?int $customerId): int
    {
        $address = Address::create([
            'user_id' => $customerId,
            'full_name' => $addressData['full_name'],
            'phone' => $addressData['phone'],
            'address_line' => $addressData['address_line'],
            'area' => $addressData['area'],
            'is_default' => false,
        ]);

        return $address->id;
    }

    /**
     * Create order record
     */
    private static function createOrderRecord(array $validated, ?int $customerId, ?int $shippingAddressId, array $totals): Order
    {
        $orderData = [
            'user_id' => $customerId,
            'shipping_address_id' => $shippingAddressId,
            'billing_address_id' => $shippingAddressId, // Same as shipping for now
            'guest_info' => $validated['is_guest'] ? $validated['guest_details'] : null,
            'status' => 'pending',
            'subtotal' => $totals['subtotal'],
            'shipping_cost' => $totals['shipping_cost'],
            'discount_total' => $totals['discount_total'],
            'tax_total' => $totals['tax_total'],
            'total' => $totals['total'],
            'payment_method' => $validated['payment_method'],
            'payment_status' => 'unpaid',
            'notes' => $validated['order_notes'],
        ];

        return Order::create($orderData);
    }

    /**
     * Create order items
     */
    private static function createOrderItems(Order $order, array $items): void
    {
        foreach ($items as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'product_variant_id' => $item['variant_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['price'],
                'total_price' => $item['price'] * $item['quantity'],
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
