<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Shipped</title>
</head>

<body
    style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
    <div style="background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="text-align: center; border-bottom: 3px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="font-size: 28px; font-weight: bold; color: #333; margin-bottom: 10px;">ReavenHour</div>
            <div style="font-size: 18px; color: #666; margin-top: 10px;">Order #{{ $order->order_number }}</div>
        </div>

        <div style="font-size: 16px; margin-bottom: 20px;">
            <h2>Great news, {{ $customerName }}!</h2>
        </div>

        <div style="font-size: 14px; color: #555; margin-bottom: 30px; line-height: 1.8;">
            <p>Your order has been shipped! We're excited to let you know that your package is on its way to you. You
                can track your shipment status below.</p>
        </div>

        <div
            style="background-color: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <h4 style="margin-top: 0; color: #155724;">📦 Shipment Status</h4>
            <p style="color: #155724; margin: 5px 0;"><strong>Order Number:</strong> {{ $order->order_number }}</p>
            <p style="color: #155724; margin: 5px 0;"><strong>Status:</strong> <span
                    style="display: inline-block; background-color: #cfe2ff; color: #084298; padding: 6px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-top: 10px;">Shipped</span>
            </p>
            <p style="color: #155724; margin: 5px 0;"><strong>Shipped On:</strong>
                {{ $order->updated_at->format('F d, Y') }}</p>
        </div>

        <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px;">Order Items
            </h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                    <tr>
                        <th
                            style="background-color: #333; color: white; padding: 12px; text-align: left; font-size: 12px;">
                            Product</th>
                        <th
                            style="background-color: #333; color: white; padding: 12px; text-align: left; font-size: 12px;">
                            Quantity</th>
                        <th
                            style="background-color: #333; color: white; padding: 12px; text-align: left; font-size: 12px;">
                            Price</th>
                        <th
                            style="background-color: #333; color: white; padding: 12px; text-align: left; font-size: 12px;">
                            Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($order->items as $item)
                        <tr>
                            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px;">
                                <strong>{{ $item->product->name }}</strong>
                                @if ($item->variant)
                                    <br><small>{{ $item->variant->title }}</small>
                                @endif
                            </td>
                            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px;">
                                {{ $item->quantity }}</td>
                            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px;">
                                ৳{{ number_format($item->unit_price, 2) }}</td>
                            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px;">
                                ৳{{ number_format($item->total_price, 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div style="background-color: #f9f9f9; border-radius: 6px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px;">Shipping
                Address</h3>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666;">Name:</span>
                <span style="color: #333;">{{ $order->shipping_address['full_name'] ?? 'N/A' }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666;">Address:</span>
                <span style="color: #333;">{{ $order->shipping_address['address_line'] ?? 'N/A' }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                <span style="font-weight: bold; color: #666;">Area:</span>
                <span
                    style="color: #333;">{{ $order->shipping_address['area'] === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka' }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: none;">
                <span style="font-weight: bold; color: #666;">Phone:</span>
                <span style="color: #333;">{{ $order->shipping_address['phone'] ?? 'N/A' }}</span>
            </div>
        </div>

        <div style="text-align: center;">
            @if ($order->user && $order->user->role === 'customer')
                <a href="{{ route('customer.orders.show', ['orderNumber' => $order->order_number]) }}"
                    style="display: inline-block; background-color: #28a745; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold;">Track
                    Your Order</a>
            @endif
        </div>

        <div
            style="font-size: 14px; color: #555; margin-bottom: 30px; line-height: 1.8; text-align: center; margin-top: 30px;">
            <p><strong>What's Next?</strong></p>
            <p>Your order is on its way! You can track the delivery status using the link above. If you have any
                questions about your shipment, please don't hesitate to contact our support team.</p>
        </div>

        <div
            style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #666;">
            <p>&copy; {{ date('Y') }} ReavenHour. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>

</html>
