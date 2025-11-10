<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
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
        $productId = $this->route('id');

        return [
            'name' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'sku' => 'required|string|unique:products,sku,' . $productId,
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
            'variants.*.id' => 'nullable|integer|exists:product_variants,id',
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
            'variants.*.existing_image_id' => 'nullable|integer|exists:product_images,id',

            // Images
            'images' => 'nullable|array',
            'images.*' => 'nullable|file|image|max:10240',
            'existing_image_ids' => 'nullable|array',
            'existing_image_ids.*' => 'integer|exists:product_images,id',

            // Deleted variants
            'deleted_variant_ids' => 'nullable|array',
            'deleted_variant_ids.*' => 'integer|exists:product_variants,id',
        ];
    }

    /**
     * Additional validation after rules pass.
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Check if at least one image exists (new or existing)
            $hasNewImages = $this->hasFile('images') && count($this->file('images')) > 0;
            $hasExistingImages = !empty($this->input('existing_image_ids')) && count($this->input('existing_image_ids')) > 0;

            if (!$hasNewImages && !$hasExistingImages) {
                $validator->errors()->add('images', 'At least one product image is required. Please upload a new image or keep an existing one.');
            }
        });
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
            'images.*.image' => 'File must be an image.',
            'images.*.max' => 'Image size must not exceed 10MB.',
        ];
    }
}

