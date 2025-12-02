<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutOrderRequest;
use App\Models\Order;
use App\Services\CartService;
use App\Services\MetaConversionApiService;
use App\Services\OptionService;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $cart = CartService::resolveCart($request, false);

        if (!$cart || !$cart->items()->exists()) {
            return redirect()->route('watches-list')->with('error', 'Your cart is empty. Please add items before proceeding to checkout.');
        }

        $shippingOptions = $this->buildShippingOptions();
        $taxSettings = $this->buildTaxSettings();

        // Get authenticated user's default address if logged in
        $authenticatedUser = null;
        if ($request->user()) {
            $user = $request->user()->load(['addresses']);
            $defaultAddress = $user->addresses()->where('is_default', true)->first();

            $authenticatedUser = [
                'fullName' => $user->name,
                'phone' => $user->phone,
                'email' => $user->email,
                'area' => $defaultAddress?->area ?? '',
                'fullAddress' => $defaultAddress?->address_line ?? '',
            ];
        }

        MetaConversionApiService::trackInitiateCheckout($cart, $request);

        return Inertia::render('Web/Checkout', [
            'shippingOptions' => $shippingOptions,
            'taxSettings' => $taxSettings,
            'authenticatedUser' => $authenticatedUser,
        ]);
    }

    public function store(CheckoutOrderRequest $request): RedirectResponse
    {
        $cart = CartService::resolveCart($request, false);

        if (!$cart || !$cart->items()->exists()) {
            return back()->withErrors([
                'cart' => 'Your cart is empty. Please add items before placing an order.',
            ])->withInput();
        }

        $cart->load(['items.product.images', 'items.variant.images']);

        $items = $cart->items;

        $unavailableItems = [];

        foreach ($items as $item) {
            $product = $item->product;
            $variant = $item->variant;

            if (!$product || !$variant) {
                $unavailableItems[] = $product?->name ?? 'Unknown product';
                continue;
            }

            if ($product->status !== 'active' || $variant->status !== 'active') {
                $unavailableItems[] = $product->name;
                continue;
            }

            if ($variant->quantity < $item->quantity) {
                $unavailableItems[] = $product->name;
            }
        }

        if (!empty($unavailableItems)) {
            return back()->withErrors([
                'cart' => 'Some items are no longer available in the desired quantity: ' . implode(', ', array_unique($unavailableItems)),
            ])->withInput();
        }

        $shippingOptions = $this->buildShippingOptions();
        $taxSettings = $this->buildTaxSettings();

        $data = $request->validated();

        $area = $data['area'];
        $shippingConfig = $shippingOptions[$area] ?? ['standard' => 0.0, 'free' => 0.0];
        $shippingCost = (float) ($shippingConfig['standard'] ?? 0.0);
        $shippingMethod = $shippingCost <= 0 ? 'free' : 'standard';

        $subtotal = $items->reduce(function (float $carry, $cartItem) {
            return $carry + ((float) $cartItem->unit_price * $cartItem->quantity);
        }, 0.0);

        $taxTotal = $taxSettings['enabled'] ? OptionService::calculateTax($subtotal) : 0.0;
        $total = $subtotal + $shippingCost + $taxTotal;

        $shippingAddress = [
            'full_name' => $data['fullName'],
            'phone' => $data['phone'],
            'email' => $data['email'],
            'address_line' => $data['fullAddress'],
            'area' => $area,
        ];

        $itemsPayload = $items->map(function ($cartItem) {
            return [
                'product_id' => $cartItem->product_id,
                'variant_id' => $cartItem->product_variant_id,
                'quantity' => $cartItem->quantity,
                'price' => (float) $cartItem->unit_price,
            ];
        })->toArray();

        $orderPayload = [
            'user_id' => $request->user()?->id,
            'shipping_address' => $shippingAddress,
            'billing_address' => $shippingAddress,
            'items' => $itemsPayload,
            'payment_method' => 'cod',
            'shipping_method' => $shippingMethod,
            'notes' => $data['orderNotes'] ?? null,
            'subtotal' => round($subtotal, 2),
            'shipping_cost' => round($shippingCost, 2),
            'discount_total' => 0,
            'tax_total' => round($taxTotal, 2),
            'total' => round($total, 2),
        ];

        try {
            $order = DB::transaction(function () use ($orderPayload, $cart, $request) {
                $order = OrderService::createOrder($orderPayload);
                CartService::clearCart($cart);

                MetaConversionApiService::trackPurchase($order, $request);

                return $order;
            });

            OrderService::sendOrderNotifications($order, $orderPayload);

            return redirect()->route('order.confirmation', ['order_number' => $order->order_number])
                ->with('success', 'Order placed successfully!');
        } catch (\Throwable $throwable) {
            report($throwable);

            return back()->withErrors([
                'checkout' => 'Unable to place order at this time. Please try again.',
            ])->withInput();
        }
    }

    public function show($order_number): Response
    {
        $order = Order::where('order_number', $order_number)->firstOrFail();
        $order->load(['items.product.images', 'items.variant.images', 'user']);

        return Inertia::render('Web/OrderConfirmation', [
            'order' => $this->transformOrder($order),
        ]);
    }

    protected function buildShippingOptions(): array
    {
        $optionShippingSettings = OptionService::getShippingSettings();

        $shippingOptions = [
            'inside_dhaka' => [
                'standard' => 10.0,
                'free' => 0.0,
            ],
            'outside_dhaka' => [
                'standard' => 25.0,
                'free' => 0.0,
            ],
        ];

        foreach ($optionShippingSettings as $area => $config) {
            if (!\is_array($config)) {
                continue;
            }

            $shippingOptions[$area] = [
                'standard' => isset($config['standard']) ? (float) $config['standard'] : ($shippingOptions[$area]['standard'] ?? 0.0),
                'free' => isset($config['free']) ? (float) $config['free'] : ($shippingOptions[$area]['free'] ?? 0.0),
            ];
        }

        return $shippingOptions;
    }

    protected function buildTaxSettings(): array
    {
        return [
            'enabled' => OptionService::isTaxEnabled(),
            'rate' => (float) OptionService::getTaxRate(),
        ];
    }

    protected function transformOrder(Order $order): array
    {
        $shipping = $order->shipping_address ?? [];

        $items = $order->items->map(function ($item) {
            $product = $item->product;
            $variant = $item->variant;

            $image = CartService::resolveItemImage($product, $variant) ?? '/placeholder.svg';

            return [
                'id' => $item->id,
                'name' => $product?->name ?? 'Product',
                'color' => $variant?->title ?? 'Default',
                'quantity' => $item->quantity,
                'price' => CartService::formatMoney((float) $item->unit_price),
                'image' => $image,
            ];
        })->values();

        return [
            'id' => $order->order_number,
            'status' => $order->status,
            'createdAt' => optional($order->created_at)->toDateString(),
            'items' => $items->toArray(),
            'shipping' => [
                'fullName' => $shipping['full_name'] ?? '',
                'phone' => $shipping['phone'] ?? '',
                'email' => $shipping['email'] ?? '',
                'area' => $shipping['area'] ?? '',
                'fullAddress' => $shipping['address_line'] ?? '',
            ],
            'payment' => [
                'method' => $this->formatPaymentMethod($order->payment_method),
            ],
            'totals' => [
                'subtotal' => $order->subtotal,
                'shipping' => $order->shipping_cost,
                'tax' => $order->tax_total,
                'total' => $order->total,
            ],
            'specialInstructions' => $order->notes,
        ];
    }

    protected function formatPaymentMethod(?string $method): string
    {
        return match ($method) {
            'cod' => 'Cash on Delivery (COD)',
            'card' => 'Card Payment',
            'bkash' => 'bKash',
            'nagad' => 'Nagad',
            'rocket' => 'Rocket',
            default => Str::title($method ?? 'Payment'),
        };
    }
}
