<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Display the current cart
     */
    public function show(Request $request): JsonResponse
    {
        $cart = CartService::resolveCart($request, false);

        if (!$cart) {
            return response()->json(['cart' => null]);
        }

        return response()->json([
            'cart' => CartService::transformCart($cart),
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

        $cart = CartService::resolveCart($request, true);

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
            'cart' => CartService::transformCart($cart),
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

        $cart = CartService::resolveCart($request, false);

        if (!$cart || $cartItem->cart_id !== $cart->id) {
            abort(404);
        }

        $cartItem->quantity = $data['quantity'];
        $cartItem->save();

        $cart->refresh();

        return response()->json([
            'cart' => CartService::transformCart($cart),
        ]);
    }

    /**
     * Remove the specified cart item
     */
    public function destroy(Request $request, CartItem $cartItem): JsonResponse
    {
        $cart = CartService::resolveCart($request, false);

        if (!$cart || $cartItem->cart_id !== $cart->id) {
            abort(404);
        }

        $cartItem->delete();

        $cart->refresh();

        return response()->json([
            'cart' => CartService::transformCart($cart),
        ]);
    }

    /**
     * Clear all items from the cart
     */
    public function clear(Request $request): JsonResponse
    {
        $cart = CartService::resolveCart($request, false);

        if (!$cart) {
            return response()->json(['cart' => null]);
        }

        CartService::clearCart($cart);

        return response()->json([
            'cart' => CartService::transformCart($cart),
        ]);
    }
}


