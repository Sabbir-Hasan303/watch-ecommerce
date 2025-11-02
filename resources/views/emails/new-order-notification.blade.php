<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Notification</title>
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
            border-bottom: 3px solid #dc3545;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .alert-badge {
            background-color: #dc3545;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            display: inline-block;
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .order-number {
            font-size: 18px;
            color: #dc3545;
            margin-top: 10px;
            font-weight: bold;
        }
        .alert-message {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
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
        .customer-info {
            background-color: #e8f4f8;
            border-left: 4px solid #007bff;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .shipping-info {
            background-color: #f8f9fa;
            border-left: 4px solid #6c757d;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .items-summary {
            background-color: #f9f9f9;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
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
            background-color: #fff3cd;
            padding: 15px;
            border-radius: 6px;
            margin-top: 20px;
            border: 2px solid #ffc107;
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
            color: #dc3545;
        }
        .cta-button {
            display: inline-block;
            background-color: #dc3545;
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
        .priority {
            color: #dc3545;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="alert-badge">NEW ORDER ALERT</div>
            <div class="logo">WatchStore</div>
            <div class="order-number">Order #{{ $order->order_number }}</div>
        </div>

        <div class="alert-message">
            <p><strong>Attention Admin:</strong> A new order has been placed and requires your attention.</p>
        </div>

        <div class="order-details">
            <h3>Order Summary</h3>
            <div class="detail-row">
                <span class="detail-label">Order Number:</span>
                <span class="detail-value priority">{{ $order->order_number }}</span>
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
                <span class="detail-label">Payment Status:</span>
                <span class="detail-value">{{ ucfirst($order->payment_status) }}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Order Status:</span>
                <span class="detail-value">
                    <span class="status-badge">{{ ucfirst($order->status) }}</span>
                </span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Shipping Method:</span>
                <span class="detail-value">{{ ucfirst($order->shipping_method) }}</span>
            </div>
        </div>

        <div class="customer-info">
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

        <h3>Order Items ({{ $order->items->count() }} items)</h3>
        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Variant</th>
                    <th>SKU</th>
                    <th>Qty</th>
                    <th style="text-align: right;">Unit Price</th>
                    <th style="text-align: right;">Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($order->items as $item)
                <tr>
                    <td><strong>{{ $item->product->name }}</strong></td>
                    <td>{{ $item->variant->title ?? 'Default' }}</td>
                    <td>{{ $item->variant->sku ?? $item->product->sku }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td style="text-align: right;">BDT {{ number_format($item->unit_price, 2) }}</td>
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
            @if ($order->discount_total > 0)
            <div class="total-row">
                <span>Discount:</span>
                <span>- BDT {{ number_format($order->discount_total, 2) }}</span>
            </div>
            @endif
            @if ($order->tax_total > 0)
            <div class="total-row">
                <span>Tax:</span>
                <span>BDT {{ number_format($order->tax_total, 2) }}</span>
            </div>
            @endif
            <div class="total-row final">
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
            <a href="{{ url('/admin/orders/' . $order->id . '/details') }}" class="cta-button">View Order in Dashboard</a>
        </div>

        <div class="footer">
            <p><strong>Action Required:</strong> Please review and process this order as soon as possible.</p>
            <p style="margin-top: 15px;">This is an automated notification from WatchStore.</p>
            <p>© {{ date('Y') }} WatchStore. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

