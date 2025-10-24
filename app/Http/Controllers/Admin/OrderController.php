<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\Address;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\OrderService;
use App\Services\OptionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        // $orders = Order::all();
        // return Inertia::render('Admin/Orders/List', [
        //     'orders' => $orders
        // ]);
        return Inertia::render('Admin/Orders/List');
    }

    public function create()
    {
        $data = OrderService::getCreatePageData();

        return Inertia::render('Admin/Orders/CreateOrder', $data);
    }

    public function store(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'customer_id' => 'nullable|integer',
                'is_guest' => 'required|boolean',
                'guest_details' => 'nullable|array',
                'selected_address_id' => 'nullable|integer|exists:addresses,id',
                'is_new_address' => 'required|boolean',
                'shipping_address' => 'required|array',
                'shipping_address.full_name' => 'required|string|max:255',
                'shipping_address.phone' => 'required|string|max:32',
                'shipping_address.address_line' => 'required|string|max:500',
                'shipping_address.area' => 'required|string|in:inside_dhaka,outside_dhaka',
                'items' => 'required|array|min:1',
                'items.*.product_id' => 'required|integer|exists:products,id',
                'items.*.variant_id' => 'required|integer|exists:product_variants,id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
                'payment_method' => 'required|string|in:cod,card,bkash,nagad,rocket',
                'shipping_method' => 'required|string|in:standard,free',
                'order_notes' => 'nullable|string|max:1000',
                'discount_code' => 'nullable|string|max:50',
                'discount_amount' => 'nullable|numeric|min:0',
                'send_confirmation_email' => 'boolean',
                'send_invoice' => 'boolean',
                'subtotal' => 'required|numeric|min:0',
                'shipping_cost' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
            ]);

            // Additional validation for customer logic
            if (!$validated['is_guest'] && !$validated['customer_id']) {
                throw new \Illuminate\Validation\ValidationException(
                    validator([], []),
                    ['customer_id' => ['Customer ID is required for registered customers.']]
                );
            }

            if (!$validated['is_guest'] && $validated['customer_id'] && !User::where('id', $validated['customer_id'])->exists()) {
                throw new \Illuminate\Validation\ValidationException(
                    validator([], []),
                    ['customer_id' => ['The selected customer does not exist.']]
                );
            }

            if ($validated['is_guest'] && $validated['customer_id']) {
                throw new \Illuminate\Validation\ValidationException(
                    validator([], []),
                    ['customer_id' => ['Customer ID should be null for guest customers.']]
                );
            }

            // Use database transaction for data consistency
            return DB::transaction(function () use ($validated) {
                // Create the order using OrderService
                $order = OrderService::createOrder($validated);

                // Send order notifications
                OrderService::sendOrderNotifications($order, $validated);

                return redirect()->route('admin.orders.index')->with('success', 'Order created successfully');
            });

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            return back()->with('error', 'Order creation failed: ' . $e->getMessage())->withInput();
        }
    }

}
