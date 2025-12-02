<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="font-size: 28px; font-weight: bold; color: #333; margin-bottom: 10px;">ReavenHour</div>
            <div style="font-size: 18px; color: #666; margin-top: 10px;">Order #{{ $order->order_number }}</div>
        </div>

        <div style="font-size: 16px; margin-bottom: 20px;">
            <h2>Thank you for your order, {{ $customerName }}!</h2>
        </div>

        <div style="font-size: 14px; color: #555; margin-bottom: 30px; line-height: 1.8;">
            <p>We're excited to confirm that we've received your order and are preparing it for shipment. Your order
                details are below, and you can also find a copy of your invoice attached to this email.</p>
        </div>

        <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px;">Order
                Information</h3>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666;">Order Number:</span>
                <span style="color: #333;"><strong>{{ $order->order_number }}</strong></span>
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
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: none;">
                <span style="font-weight: bold; color: #666;">Order Status:</span>
                <span style="color: #333;">
                    <span
                        style="display: inline-block; background-color: #fff3cd; color: #856404; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-top: 10px;">{{ ucfirst($order->status) }}</span>
                </span>
            </div>
        </div>

        <div
            style="background-color: #e8f4f8; border-left: 4px solid #007bff; padding: 15px; margin: 20px 0; border-radius: 4px;">
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

        <h3 style="margin-top: 20px; margin-bottom: 10px; color: #333;">Order Items</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
                <tr>
                    <th style="background-color: #333; color: white; padding: 12px; text-align: left; font-size: 12px;">
                        Item</th>
                    <th style="background-color: #333; color: white; padding: 12px; text-align: left; font-size: 12px;">
                        Variant</th>
                    <th style="background-color: #333; color: white; padding: 12px; text-align: left; font-size: 12px;">
                        Quantity</th>
                    <th
                        style="background-color: #333; color: white; padding: 12px; text-align: right; font-size: 12px;">
                        Price</th>
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
                            {{ $item->quantity }}</td>
                        <td
                            style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; text-align: right;">
                            BDT {{ number_format($item->total_price, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-top: 20px;">
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
                <span>Subtotal:</span>
                <span>BDT {{ number_format($order->subtotal, 2) }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
                <span>Shipping:</span>
                <span>BDT {{ number_format($order->shipping_cost, 2) }}</span>
            </div>
            @if ($order->tax_total > 0)
                <div style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px;">
                    <span>Tax:</span>
                    <span>BDT {{ number_format($order->tax_total, 2) }}</span>
                </div>
            @endif
            <div
                style="display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 15px; margin-top: 10px; color: #333;">
                <span>Total:</span>
                <span>BDT {{ number_format($order->total, 2) }}</span>
            </div>
        </div>

        <div style="text-align: center;">
            @if ($order->user && $order->user->role === 'customer')
                <a href="{{ route('customer.orders.show', ['orderNumber' => $order->order_number]) }}"
                    style="display: inline-block; background-color: #333; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold;">View
                    Order Details</a>
            @endif
        </div>

        <div
            style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666;">
            <p>Thank you for choosing ReavenHour!</p>
            <p>This is an automated email. Please do not reply to this message.</p>
            <p style="margin-top: 15px;">© {{ date('Y') }} ReavenHour. All rights reserved.</p>
        </div>
    </div>
</body>

</html>
