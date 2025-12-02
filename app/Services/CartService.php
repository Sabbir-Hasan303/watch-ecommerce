<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CartService
{
    public static function resolveCart(Request $request, bool $createIfMissing = false): ?Cart
    {
        $user = $request->user();

        if ($user) {
            $cart = Cart::where('user_id', $user->id)->first();

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

    public static function transformCart(Cart $cart): array
    {
        $cart->loadMissing([
            'items.product.images',
            'items.variant',
        ]);

        $items = $cart->items->map(function (CartItem $item) {
            $product = $item->product;
            $variant = $item->variant;

            $imageUrl = self::resolveItemImage($product, $variant) ?? '/placeholder.svg';

            $unitPrice = (float) $item->unit_price;

            return [
                'id' => $item->id,
                'productId' => $product->id,
                'productVariantId' => $variant?->id,
                'name' => $product->name,
                'color' => $variant?->title ?? 'Default',
                'quantity' => $item->quantity,
                'unitPrice' => $unitPrice,
                'price' => self::formatMoney($unitPrice),
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
            'subtotalFormatted' => self::formatMoney($subtotal),
        ];
    }

    public static function clearCart(Cart $cart): void
    {
        $cart->items()->delete();
        $cart->refresh();
    }

    public static function resolveItemImage(Product $product, ?ProductVariant $variant): ?string
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

    public static function formatMoney(float $value): string
    {
        return number_format($value, 2);
    }
}


