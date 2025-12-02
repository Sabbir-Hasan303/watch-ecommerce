<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'sku' => 'required|string|unique:products,sku',
            'status' => 'required|in:active,draft',

            // Categories
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:categories,id',

            // Features
            'features' => 'nullable|array',
            'features.*.name' => 'required|string',
            'features.*.type' => 'required|string',
            'features.*.icon' => 'nullable|string',

            // Technical specs
            'technical_specs' => 'nullable|array',
            'technical_specs.*.key' => 'required|string',
            'technical_specs.*.value' => 'required|string',

            // Model features
            'model_features' => 'nullable|array',
            'model_features.*.name' => 'required|string',
            'model_features.*.category' => 'nullable|string',

            // Variants
            'variants' => 'required|array|min:1',
            'variants.*.title' => 'required|string',
            'variants.*.sku' => 'required|string',
            'variants.*.price' => 'required|numeric|min:0',
            'variants.*.quantity' => 'required|integer|min:0',
            'variants.*.status' => 'required|in:active,draft',
            'variants.*.size' => 'nullable|string',
            'variants.*.color' => 'nullable|string',
            'variants.*.material' => 'nullable|string',
            'variants.*.compare_at_price' => 'nullable|numeric|min:0',
            'variants.*.image' => 'nullable|file',

            // Images
            'images' => 'required|array|min:1',
            'images.*' => 'required|file|image|max:10240',
        ];
    }

    /**
     * Get custom error messages.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Product name is required.',
            'sku.required' => 'SKU is required.',
            'sku.unique' => 'This SKU is already in use.',
            'categories.required' => 'At least one category must be selected.',
            'categories.min' => 'Please select at least one category.',
            'variants.required' => 'At least one variant is required.',
            'variants.min' => 'Product must have at least one variant.',
            'images.required' => 'At least one product image is required.',
            'images.min' => 'Please upload at least one product image.',
            'images.*.required' => 'Product image is required.',
            'images.*.image' => 'File must be an image.',
            'images.*.max' => 'Image size must not exceed 10MB.',
        ];
    }
}

