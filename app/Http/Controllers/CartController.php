<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CartController extends Controller
{
    /**
     * Display the current cart
     */
    public function show(Request $request): JsonResponse
    {
        $cart = $this->resolveCart($request, false);

        if (!$cart) {
            return response()->json(['cart' => null]);
        }

        return response()->json([
            'cart' => $this->transformCart($cart),
        ]);
    }

    /**
     * Store a newly created cart item or update quantity if it already exists
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'product_variant_id' => ['nullable', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = $this->resolveCart($request, true);

        $product = Product::with(['images', 'variants'])->findOrFail($data['product_id']);

        $variant = null;
        if (!empty($data['product_variant_id'])) {
            $variant = $product->variants->firstWhere('id', (int) $data['product_variant_id']);

            if (!$variant) {
                abort(422, 'Invalid product variant selected.');
            }
        }

        $unitPrice = $variant?->price ?? $product->min_price ?? 0;

        $cartItemQuery = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id);

        if ($variant) {
            $cartItemQuery->where('product_variant_id', $variant->id);
        } else {
            $cartItemQuery->whereNull('product_variant_id');
        }

        $cartItem = $cartItemQuery->first();

        if ($cartItem) {
            $cartItem->quantity += $data['quantity'];
            $cartItem->unit_price = $unitPrice;
            $cartItem->save();
        } else {
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'quantity' => $data['quantity'],
                'unit_price' => $unitPrice,
            ]);
        }

        $cart->refresh();

        return response()->json([
            'cart' => $this->transformCart($cart),
        ]);
    }

    /**
     * Update the quantity of a cart item
     */
    public function update(Request $request, CartItem $cartItem): JsonResponse
    {
        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $cart = $this->resolveCart($request, false);

        if (!$cart || $cartItem->cart_id !== $cart->id) {
            abort(404);
        }

        $cartItem->quantity = $data['quantity'];
        $cartItem->save();

        $cart->refresh();

        return response()->json([
            'cart' => $this->transformCart($cart),
        ]);
    }

    /**
     * Remove the specified cart item
     */
    public function destroy(Request $request, CartItem $cartItem): JsonResponse
    {
        $cart = $this->resolveCart($request, false);

        if (!$cart || $cartItem->cart_id !== $cart->id) {
            abort(404);
        }

        $cartItem->delete();

        $cart->refresh();

        return response()->json([
            'cart' => $this->transformCart($cart),
        ]);
    }

    /**
     * Clear all items from the cart
     */
    public function clear(Request $request): JsonResponse
    {
        $cart = $this->resolveCart($request, false);

        if (!$cart) {
            return response()->json(['cart' => null]);
        }

        $cart->items()->delete();
        $cart->refresh();

        return response()->json([
            'cart' => $this->transformCart($cart),
        ]);
    }

    /**
     * Resolve the cart for the current user or guest session
     */
    protected function resolveCart(Request $request, bool $createIfMissing): ?Cart
    {
        $user = $request->user();

        if ($user) {
            $query = Cart::where('user_id', $user->id);
            $cart = $query->first();

            if ($cart) {
                return $cart;
            }

            return $createIfMissing ? Cart::create(['user_id' => $user->id]) : null;
        }

        $guestSessionId = $request->session()->get('guest_cart_id');

        if (!$guestSessionId) {
            if (!$createIfMissing) {
                return null;
            }

            $guestSessionId = (string) Str::uuid();
            $request->session()->put('guest_cart_id', $guestSessionId);
        }

        $cart = Cart::where('guest_session_id', $guestSessionId)->first();

        if ($cart) {
            return $cart;
        }

        return $createIfMissing ? Cart::create(['guest_session_id' => $guestSessionId]) : null;
    }

    /**
     * Transform the cart model for frontend consumption
     */
    protected function transformCart(Cart $cart): array
    {
        $cart->loadMissing([
            'items.product.images',
            'items.variant',
        ]);

        $items = $cart->items->map(function (CartItem $item) {
            $product = $item->product;
            $variant = $item->variant;

            $imageUrl = $this->resolveItemImage($product, $variant) ?? '/placeholder.svg';

            $unitPrice = (float) $item->unit_price;

            return [
                'id' => $item->id,
                'productId' => $product->id,
                'productVariantId' => $variant?->id,
                'name' => $product->name,
                'color' => $variant?->title ?? 'Default',
                'quantity' => $item->quantity,
                'unitPrice' => $unitPrice,
                'price' => $this->formatMoney($unitPrice),
                'image' => $imageUrl,
                'sku' => $variant?->sku ?? $product->sku,
            ];
        })->values();

        $subtotal = $items->reduce(function ($carry, $item) {
            return $carry + ($item['unitPrice'] * $item['quantity']);
        }, 0.0);

        return [
            'id' => $cart->id,
            'items' => $items,
            'itemCount' => $cart->items->sum('quantity'),
            'subtotal' => round($subtotal, 2),
            'subtotalFormatted' => $this->formatMoney($subtotal),
        ];
    }

    /**
     * Resolve the best image to display for a cart item
     */
    protected function resolveItemImage(Product $product, ?ProductVariant $variant): ?string
    {
        $images = $product->images;

        $image = $images->firstWhere('product_variant_id', $variant?->id)
            ?? $images->firstWhere('is_primary', true)
            ?? $images->first();

        $imagePath = $image?->image_path ?? $product->primary_image_url;

        if (!$imagePath) {
            return null;
        }

        if (Str::startsWith($imagePath, ['http://', 'https://', '//', '/'])) {
            return $imagePath;
        }

        return Storage::url($imagePath);
    }

    protected function formatMoney(float $value): string
    {
        return '$' . number_format($value, 2);
    }
}


