<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Notification</title>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; border-bottom: 3px solid #dc3545; padding-bottom: 20px; margin-bottom: 30px;">
            <div
                style="background-color: #dc3545; color: white; padding: 8px 16px; border-radius: 4px; display: inline-block; font-size: 14px; font-weight: bold; margin-bottom: 10px;">
                NEW ORDER ALERT</div>
            <div style="font-size: 28px; font-weight: bold; color: #333; margin-bottom: 10px;">ReavenHour</div>
            <div style="font-size: 18px; color: #dc3545; margin-top: 10px; font-weight: bold;">Order
                #{{ $order->order_number }}</div>
        </div>

        <div
            style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 14px;">
            <p><strong>Attention Admin:</strong> A new order has been placed and requires your attention.</p>
        </div>

        <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px;">Order Summary
            </h3>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666;">Order Number:</span>
                <span style="color: #dc3545; font-weight: bold;">{{ $order->order_number }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666;">Order Date:</span>
                <span style="color: #333;">{{ $order->created_at->format('F d, Y h:i A') }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666;">Payment Method:</span>
                <span
                    style="color: #333;">{{ $order->payment_method === 'cod' ? 'Cash on Delivery' : ucfirst($order->payment_method) }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666;">Payment Status:</span>
                <span style="color: #333;">{{ ucfirst($order->payment_status) }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666;">Order Status:</span>
                <span style="color: #333;">
                    <span
                        style="display: inline-block; background-color: #fff3cd; color: #856404; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-top: 10px;">{{ ucfirst($order->status) }}</span>
                </span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: none;">
                <span style="font-weight: bold; color: #666;">Shipping Method:</span>
                <span style="color: #333;">{{ ucfirst($order->shipping_method) }}</span>
            </div>
        </div>

        <div
            style="background-color: #e8f4f8; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0;">Customer Information</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> {{ $customerName }}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> {{ $customerEmail }}</p>
            @if ($order->user)
                <p style="margin: 5px 0;"><strong>Phone:</strong> {{ $order->user->phone ?? 'N/A' }}</p>
                <p style="margin: 5px 0;"><strong>Customer Type:</strong> Registered User</p>
            @else
                <p style="margin: 5px 0;"><strong>Phone:</strong> {{ $order->shipping_address['phone'] ?? 'N/A' }}</p>
                <p style="margin: 5px 0;"><strong>Customer Type:</strong> Guest Checkout</p>
            @endif
        </div>

        <div
            style="background-color: #f8f9fa; border-left: 4px solid #6c757d; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p style="margin: 5px 0;"><strong>{{ $order->shipping_address['full_name'] ?? 'N/A' }}</strong></p>
            <p style="margin: 5px 0;">{{ $order->shipping_address['phone'] ?? 'N/A' }}</p>
            <p style="margin: 5px 0;">{{ $order->shipping_address['email'] ?? 'N/A' }}</p>
            <p style="margin: 5px 0;">
                {{ $order->shipping_address['address_line'] ?? 'N/A' }}
                @php
                    $area = isset($order->shipping_address['area'])
                        ? ($order->shipping_address['area'] === 'inside_dhaka'
                            ? 'Inside Dhaka'
                            : 'Outside Dhaka')
                        : '';
                @endphp
                @if ($area)
                    ({{ $area }})
                @endif
            </p>
        </div>

        <h3 style="margin-top: 20px; margin-bottom: 10px; color: #333;">Order Items ({{ $order->items->count() }}
            items)</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
                <tr>
                    <th style="background-color: #333; color: white; padding: 12px; text-align: left; font-size: 12px;">
                        Item</th>
                    <th style="background-color: #333; color: white; padding: 12px; text-align: left; font-size: 12px;">
                        Variant</th>
                    <th style="background-color: #333; color: white; padding: 12px; text-align: left; font-size: 12px;">
                        SKU</th>
                    <th style="background-color: #333; color: white; padding: 12px; text-align: left; font-size: 12px;">
                        Qty</th>
                    <th
                        style="background-color: #333; color: white; padding: 12px; text-align: right; font-size: 12px;">
                        Unit Price</th>
                    <th
                        style="background-color: #333; color: white; padding: 12px; text-align: right; font-size: 12px;">
                        Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($order->items as $item)
                    <tr>
                        <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px;">
                            <strong>{{ $item->product->name }}</strong>
                        </td>
                        <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px;">
                            {{ $item->variant->title ?? 'Default' }}</td>
                        <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px;">
                            {{ $item->variant->sku ?? $item->product->sku }}</td>
                        <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px;">
                            {{ $item->quantity }}</td>
                        <td
                            style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; text-align: right;">
                            BDT {{ number_format($item->unit_price, 2) }}</td>
                        <td
                            style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; text-align: right;">
                            BDT {{ number_format($item->total_price, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div
            style="background-color: #fff3cd; padding: 15px; border-radius: 6px; margin-top: 20px; border: 2px solid #ffc107;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
                <span>Subtotal:</span>
                <span>BDT {{ number_format($order->subtotal, 2) }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
                <span>Shipping:</span>
                <span>BDT {{ number_format($order->shipping_cost, 2) }}</span>
            </div>
            @if ($order->discount_total > 0)
                <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
                    <span>Discount:</span>
                    <span>- BDT {{ number_format($order->discount_total, 2) }}</span>
                </div>
            @endif
            @if ($order->tax_total > 0)
                <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
                    <span>Tax:</span>
                    <span>BDT {{ number_format($order->tax_total, 2) }}</span>
                </div>
            @endif
            <div
                style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 15px; margin-top: 10px; color: #dc3545;">
                <span>Total Amount:</span>
                <span>BDT {{ number_format($order->total, 2) }}</span>
            </div>
        </div>

        @if ($order->notes)
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4 style="margin-top: 0;">Order Notes:</h4>
                <p style="margin: 0; font-style: italic;">{{ $order->notes }}</p>
            </div>
        @endif

        <div style="text-align: center;">
            <a href="{{ url('/admin/orders/' . $order->id . '/details') }}"
                style="display: inline-block; background-color: #dc3545; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold;">View
                Order in Dashboard</a>
        </div>

        <div
            style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666;">
            <p><strong>Action Required:</strong> Please review and process this order as soon as possible.</p>
            <p style="margin-top: 15px;">This is an automated notification from ReavenHour.</p>
            <p>© {{ date('Y') }} ReavenHour. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
