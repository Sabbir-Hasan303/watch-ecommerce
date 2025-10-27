<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>Invoice - {{ $order->order_number }}</title>
    <style>
        @page {
            margin: 15mm;
            size: A4;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .invoice-container {
            width: 100%;
            max-width: 100%;
        }

        .header {
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 15px;
        }

        .header-left {
            float: left;
            width: 50%;
        }

        .header-right {
            float: right;
            width: 45%;
            text-align: right;
        }

        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin: 0;
        }

        .invoice-title {
            font-size: 28px;
            font-weight: bold;
            color: #333;
            margin: 0 0 5px 0;
        }

        .order-info {
            font-size: 14px;
            color: #666;
            margin: 2px 0;
        }

        .status {
            display: inline-block;
            padding: 4px 8px;
            background: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 10px;
        }

        .status-pending {
            background: #fff3cd;
            color: #856404;
        }

        .status-confirmed {
            background: #d1ecf1;
            color: #0c5460;
        }

        .status-shipped {
            background: #e2e3f1;
            color: #383d41;
        }

        .status-delivered {
            background: #d4edda;
            color: #155724;
        }

        .status-cancelled {
            background: #f8d7da;
            color: #721c24;
        }

        .clearfix::after {
            content: "";
            display: table;
            clear: both;
        }

        .details-section {
            margin: 20px 0;
        }

        .details-row {
            display: table;
            width: 100%;
            margin-bottom: 15px;
        }

        .details-col {
            display: table-cell;
            width: 48%;
            vertical-align: top;
            padding-right: 2%;
        }

        .details-col:last-child {
            padding-right: 0;
            padding-left: 2%;
        }

        .section-title {
            font-weight: bold;
            font-size: 14px;
            color: #333;
            margin-bottom: 8px;
            border-bottom: 1px solid #ccc;
            padding-bottom: 3px;
        }

        .detail-item {
            margin: 3px 0;
            font-size: 12px;
        }

        .items-section {
            margin: 20px 0;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        .items-table th {
            background: #f5f5f5;
            border: 1px solid #ccc;
            padding: 8px 5px;
            font-weight: bold;
            font-size: 11px;
            text-align: left;
        }

        .items-table td {
            border: 1px solid #ccc;
            padding: 8px 5px;
            font-size: 11px;
            vertical-align: top;
        }

        .items-table .text-center {
            text-align: center;
        }

        .items-table .text-right {
            text-align: right;
        }

        .totals-section {
            margin: 20px 0;
        }

        .totals-table {
            width: 300px;
            float: right;
            border-collapse: collapse;
        }

        .totals-table td {
            border: 1px solid #ccc;
            padding: 6px 8px;
            font-size: 12px;
        }

        .totals-table .label {
            background: #f5f5f5;
            font-weight: bold;
            text-align: left;
        }

        .totals-table .value {
            text-align: right;
            font-weight: bold;
        }

        .totals-table .total-row {
            background: #f0f0f0;
            font-size: 14px;
            font-weight: bold;
        }

        .payment-section {
            margin: 30px 0 20px 0;
            clear: both;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
        }

        .currency-symbol {
            font-weight: bold;
        }
    </style>
</head>

<body>
    <div class="invoice-container">
        <!-- Header -->
        <div class="header clearfix">
            <div class="header-left">
                <h1 class="company-name">WatchStore</h1>
            </div>
            <div class="header-right">
                <h2 class="invoice-title">INVOICE</h2>
                <div class="order-info">Order #{{ $order->order_number }}</div>
                <div class="order-info">{{ $order->created_at->format('M d, Y') }}</div>
                {{-- <div class="status status-{{ $order->status }}">
                    {{ ucfirst($order->status) }}
                </div> --}}
            </div>
        </div>

        <!-- Customer Details -->
        <div class="details-section">
            <div class="details-row">
                <div class="details-col">
                    <div class="section-title">Bill To</div>
                    @if ($order->user)
                        <div class="detail-item"><strong>{{ $order->user->name }}</strong></div>
                        <div class="detail-item">{{ $order->user->phone }}</div>
                        {{-- @php
                            $defaultAddress = $order->user->addresses->where('is_default', 1)->first();
                        @endphp
                        @if ($defaultAddress)
                            <div class="detail-item">{{ $defaultAddress->phone }}</div>
                        @endif --}}
                        <div class="detail-item">{{ $order->user->email }}</div>
                    @else
                        <div class="detail-item"><strong>{{ $order->shipping_address['full_name'] ?? 'Guest' }}</strong>
                        </div>
                        <div class="detail-item">{{ $order->shipping_address['phone'] }}</div>
                        <div class="detail-item">{{ $order->shipping_address['email'] }}</div>
                    @endif
                </div>

                <div class="details-col">
                    <div class="section-title">Ship To</div>
                    <div class="detail-item"><strong>{{ $order->shipping_address['full_name'] ?? 'Guest' }}</strong>
                    </div>
                    <div class="detail-item">{{ $order->shipping_address['phone'] }}</div>
                    <div class="detail-item">{{ $order->shipping_address['email'] }}</div>
                    @php
                        $area = $order->shipping_address['area'] === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka';
                    @endphp
                    <div class="detail-item">{{ $order->shipping_address['address_line'] }} ({{ $area }})</div>
                </div>
            </div>
        </div>

        <!-- Items Table -->
        <div class="items-section">
            <table class="items-table">
                <thead>
                    <tr>
                        <th style="width: 35%;">Item</th>
                        <th style="width: 20%;">Variant</th>
                        <th style="width: 15%;">SKU</th>
                        <th style="width: 8%;" class="text-center">Qty</th>
                        <th style="width: 11%;" class="text-right">Price</th>
                        <th style="width: 11%;" class="text-right">Total</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($order->items as $item)
                        <tr>
                            <td><strong>{{ $item->product->name }}</strong></td>
                            <td>{{ $item->variant->title ?? 'Default' }}</td>
                            <td>{{ $item->variant->sku ?? $item->product->sku }}</td>
                            <td class="text-center">{{ $item->quantity }}</td>
                            <td class="text-right">BDT {{ number_format($item->unit_price, 2) }}</td>
                            <td class="text-right">BDT {{ number_format($item->total_price, 2) }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <!-- Totals -->
        <div class="totals-section">
            <table class="totals-table">
                <tr>
                    <td class="label">Subtotal:</td>
                    <td class="value">BDT {{ number_format($order->subtotal, 2) }}</td>
                </tr>
                <tr>
                    <td class="label">Shipping:</td>
                    <td class="value">BDT {{ number_format($order->shipping_cost, 2) }}</td>
                </tr>
                @if ($order->tax_total > 0)
                    <tr>
                        <td class="label">Tax:</td>
                        <td class="value">BDT {{ number_format($order->tax_total, 2) }}</td>
                    </tr>
                @endif
                <tr class="total-row">
                    <td class="label">Total:</td>
                    <td class="value">BDT {{ number_format($order->total, 2) }}</td>
                </tr>
            </table>
        </div>

        <!-- Payment Information -->
        <div class="payment-section">
            <div class="section-title">Payment Information</div>
            <div class="detail-item">
                <strong>Payment Method:</strong>
                {{ $order->payment_method === 'cod' ? 'Cash on Delivery' : ucfirst($order->payment_method) }}
            </div>
            @if ($order->tracking_number)
                <div class="detail-item">
                    <strong>Tracking Number:</strong> {{ $order->tracking_number }}
                </div>
            @endif
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Thank you for your business!</p>
            <p>This is a computer-generated invoice.</p>
        </div>

        {{-- @php
            dd($order);
        @endphp --}}
    </div>
</body>

</html>
