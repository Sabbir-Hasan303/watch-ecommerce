<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
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
        .total-section {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
        }
        .total-row.final {
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #333;
            padding-top: 15px;
            margin-top: 10px;
            color: #333;
        }
        .cta-button {
            display: inline-block;
            background-color: #333;
            color: #ffffff;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 12px;
            color: #666;
        }
        .shipping-info {
            background-color: #e8f4f8;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .status-badge {
            display: inline-block;
            background-color: #fff3cd;
            color: #856404;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
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
            <h2>Thank you for your order, {{ $customerName }}!</h2>
        </div>

        <div class="message">
            <p>We're excited to confirm that we've received your order and are preparing it for shipment. Your order details are below, and you can also find a copy of your invoice attached to this email.</p>
        </div>

        <div class="order-details">
            <h3>Order Information</h3>
            <div class="detail-row">
                <span class="detail-label">Order Number:</span>
                <span class="detail-value"><strong>{{ $order->order_number }}</strong></span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Order Date:</span>
                <span class="detail-value">{{ $order->created_at->format('F d, Y h:i A') }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">{{ $order->payment_method === 'cod' ? 'Cash on Delivery' : ucfirst($order->payment_method) }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Order Status:</span>
                <span class="detail-value">
                    <span class="status-badge">{{ ucfirst($order->status) }}</span>
                </span>
            </div>
        </div>

        <div class="shipping-info">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p style="margin: 5px 0;"><strong>{{ $order->shipping_address['full_name'] ?? 'N/A' }}</strong></p>
            <p style="margin: 5px 0;">{{ $order->shipping_address['phone'] ?? 'N/A' }}</p>
            <p style="margin: 5px 0;">{{ $order->shipping_address['email'] ?? 'N/A' }}</p>
            <p style="margin: 5px 0;">
                {{ $order->shipping_address['address_line'] ?? 'N/A' }}
                @php
                    $area = isset($order->shipping_address['area'])
                        ? ($order->shipping_address['area'] === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka')
                        : '';
                @endphp
                @if($area)
                    ({{ $area }})
                @endif
            </p>
        </div>

        <h3>Order Items</h3>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Variant</th>
                    <th>Quantity</th>
                    <th style="text-align: right;">Price</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($order->items as $item)
                <tr>
                    <td><strong>{{ $item->product->name }}</strong></td>
                    <td>{{ $item->variant->title ?? 'Default' }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td style="text-align: right;">BDT {{ number_format($item->total_price, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>

        <div class="total-section">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>BDT {{ number_format($order->subtotal, 2) }}</span>
            </div>
            <div class="total-row">
                <span>Shipping:</span>
                <span>BDT {{ number_format($order->shipping_cost, 2) }}</span>
            </div>
            @if ($order->tax_total > 0)
            <div class="total-row">
                <span>Tax:</span>
                <span>BDT {{ number_format($order->tax_total, 2) }}</span>
            </div>
            @endif
            <div class="total-row final">
                <span>Total:</span>
                <span>BDT {{ number_format($order->total, 2) }}</span>
            </div>
        </div>

        <div style="text-align: center;">
            @php
                $orderUrl = $order->user
                    ? (url('/customer/orders/' . $order->order_number) ?? '#')
                    : (url('/orders/' . $order->order_number . '/confirmation') ?? '#');
            @endphp
            @if($orderUrl !== '#')
                <a href="{{ $orderUrl }}" class="cta-button">View Order Details</a>
            @else
                <p style="font-size: 12px; color: #666;">You can track your order using order number: <strong>{{ $order->order_number }}</strong></p>
            @endif
        </div>

        <div class="footer">
            <p>Thank you for choosing WatchStore!</p>
            <p>This is an automated email. Please do not reply to this message.</p>
            <p style="margin-top: 15px;">© {{ date('Y') }} WatchStore. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

