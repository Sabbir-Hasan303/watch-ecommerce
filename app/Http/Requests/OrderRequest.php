<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'user_id' => 'nullable|integer|exists:users,id',
            'shipping_address' => 'required|array',
            'shipping_address.full_name' => 'required|string|max:255',
            'shipping_address.phone' => 'required|string|max:32',
            'shipping_address.email' => 'required|email|max:255',
            'shipping_address.address_line' => 'required|string|max:500',
            'shipping_address.area' => 'required|string|in:inside_dhaka,outside_dhaka',
            'billing_address' => 'required|array',
            'billing_address.full_name' => 'required|string|max:255',
            'billing_address.phone' => 'required|string|max:32',
            'billing_address.email' => 'required|email|max:255',
            'billing_address.address_line' => 'required|string|max:500',
            'billing_address.area' => 'required|string|in:inside_dhaka,outside_dhaka',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.variant_id' => 'required|integer|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string|in:cod,card,bkash,nagad,rocket',
            'shipping_method' => 'required|string|in:standard,free',
            'notes' => 'nullable|string|max:1000',
            'subtotal' => 'required|numeric|min:0',
            'shipping_cost' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
        ];

        // Add update-specific rules
        if ($this->routeIs('admin.orders.update')) {
            $rules['order_id'] = 'required|integer|exists:orders,id';
            $rules['items.*.id'] = 'nullable|integer|exists:order_items,id';
            $rules['items.*.unit_price'] = 'required|numeric|min:0';
            $rules['status'] = 'required|string|in:pending,confirmed,shipped,delivered,cancelled';
            $rules['discount_total'] = 'required|numeric|min:0';
            $rules['tax_total'] = 'required|numeric|min:0';
        } else {
            // Create-specific rules
            $rules['items.*.price'] = 'required|numeric|min:0';
            $rules['discount_code'] = 'nullable|string|max:50';
            $rules['discount_amount'] = 'nullable|numeric|min:0';
            $rules['send_confirmation_email'] = 'boolean';
            $rules['send_invoice'] = 'boolean';
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'shipping_address.full_name.required' => 'The full name is required for shipping address.',
            'shipping_address.phone.required' => 'The phone number is required for shipping address.',
            'shipping_address.email.required' => 'The email is required for shipping address.',
            'shipping_address.email.email' => 'The shipping email must be a valid email address.',
            'shipping_address.address_line.required' => 'The address line is required for shipping address.',
            'shipping_address.area.required' => 'The area is required for shipping address.',
            'billing_address.full_name.required' => 'The full name is required for billing address.',
            'billing_address.phone.required' => 'The phone number is required for billing address.',
            'billing_address.email.required' => 'The email is required for billing address.',
            'billing_address.email.email' => 'The billing email must be a valid email address.',
            'billing_address.address_line.required' => 'The address line is required for billing address.',
            'billing_address.area.required' => 'The area is required for billing address.',
            'items.required' => 'At least one item is required for the order.',
            'items.min' => 'At least one item is required for the order.',
            'items.*.product_id.required' => 'Product ID is required for each item.',
            'items.*.variant_id.required' => 'Product variant ID is required for each item.',
            'items.*.quantity.required' => 'Quantity is required for each item.',
            'items.*.quantity.min' => 'Quantity must be at least 1 for each item.',
        ];
    }
}
