<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Delivered</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .order-number {
            font-size: 18px;
            color: #666;
            margin-top: 10px;
        }
        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
        }
        .message {
            font-size: 14px;
            color: #555;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        .order-details {
            background-color: #f9f9f9;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .order-details h3 {
            margin-top: 0;
            color: #333;
            border-bottom: 2px solid #ddd;
            padding-bottom: 10px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: bold;
            color: #666;
        }
        .detail-value {
            color: #333;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        .items-table th {
            background-color: #333;
            color: white;
            padding: 12px;
            text-align: left;
            font-size: 12px;
        }
        .items-table td {
            padding: 10px 12px;
            border-bottom: 1px solid #eee;
            font-size: 13px;
        }
        .items-table tr:last-child td {
            border-bottom: none;
        }
        .cta-button {
            display: inline-block;
            background-color: #17a2b8;
            color: #ffffff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .delivery-info {
            background-color: #d1ecf1;
            border-left: 4px solid #17a2b8;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .delivery-info h4 {
            margin-top: 0;
            color: #0c5460;
        }
        .delivery-info p {
            color: #0c5460;
            margin: 5px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .status-badge {
            display: inline-block;
            background-color: #d4edda;
            color: #155724;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
        }
        .review-section {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .review-section h4 {
            margin-top: 0;
            color: #856404;
        }
        .review-section p {
            color: #856404;
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="logo">WatchStore</div>
            <div class="order-number">Order #{{ $order->order_number }}</div>
        </div>

        <div class="greeting">
            <h2>Your order has been delivered! ✓</h2>
        </div>

        <div class="message">
            <p>We're thrilled to confirm that your order has been successfully delivered. We hope you love your purchase! If you have any concerns or need assistance, please don't hesitate to reach out.</p>
        </div>

        <div class="delivery-info">
            <h4>✓ Delivery Confirmed</h4>
            <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
            <p><strong>Status:</strong> <span class="status-badge">Delivered</span></p>
            <p><strong>Delivered On:</strong> {{ $order->updated_at->format('F d, Y') }}</p>
        </div>

        <div class="order-details">
            <h3>Order Items</h3>
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($order->items as $item)
                    <tr>
                        <td>
                            <strong>{{ $item->product->name }}</strong>
                            @if($item->variant)
                                <br><small>{{ $item->variant->title }}</small>
                            @endif
                        </td>
                        <td>{{ $item->quantity }}</td>
                        <td>৳{{ number_format($item->unit_price, 2) }}</td>
                        <td>৳{{ number_format($item->total_price, 2) }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="review-section">
            <h4>⭐ We'd love your feedback!</h4>
        </div>

        <div class="order-details">
            <h3>Delivery Address</h3>
            <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">{{ $order->shipping_address['full_name'] ?? 'N/A' }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Address:</span>
                <span class="detail-value">{{ $order->shipping_address['address_line'] ?? 'N/A' }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Area:</span>
                <span class="detail-value">{{ $order->shipping_address['area'] === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka' }}</span>
            </div>
        </div>

        <div style="text-align: center;">
            @if($order->user)
                <a href="{{ route('customer.orders.show', ['orderNumber' => $order->order_number]) }}" class="cta-button">View Order Details</a>
            @else
                <a href="{{ route('order.confirmation', ['order' => $order]) }}" class="cta-button">View Order Details</a>
            @endif
        </div>

        <div class="message" style="text-align: center; margin-top: 30px;">
            <p><strong>Thank you for shopping with us!</strong></p>
            <p>We appreciate your business and hope to serve you again soon. If you have any questions or need support, our team is always here to help.</p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} WatchStore. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>

