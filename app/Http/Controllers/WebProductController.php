<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class WebProductController extends Controller
{
    public function productList()
    {
        $products = Product::with([
            'categories:id,name',
            'variants:id,product_id,price,compare_at_price,color,material,size,status',
            'images:id,product_id,image_path,is_primary',
        ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'category' => $product->primary_category,
                    'primaryImage' => $product->primary_image_url,
                    'priceRange' => [
                        'min' => $product->min_price,
                        'max' => $product->max_price,
                    ],
                    'compareAtRange' => [
                        'min' => $product->min_compare_at_price,
                        'max' => $product->max_compare_at_price,
                    ],
                    'discount' => [
                        'amount' => $product->discount_amount,
                        'percentage' => $product->discount_percentage,
                    ],
                    'colors' => $product->color_options,
                    'materials' => $product->material_options,
                    'sizes' => $product->size_options,
                    'status' => $product->status,
                ];
            })
            ->values();

        return Inertia::render('Web/ProductList', [
            'products' => $products,
        ]);
    }

    public function singleProduct(string $slug)
    {
        $product = Product::with([
            'categories:id,name',
            'images:id,product_id,image_path,is_primary,product_variant_id',
            'variants' => function ($query) {
                $query->select('id', 'product_id', 'title', 'sku', 'size', 'color', 'material', 'price', 'compare_at_price', 'quantity', 'status');
            },
        ])
            ->where('slug', $slug)
            ->first();

        if (!$product) {
            return redirect()->route('watches-list')->with('error', 'Product not found');
        }

        $cardRelationships = [
            'categories:id,name',
            'variants:id,product_id,price,compare_at_price,color,material,size,status',
            'images:id,product_id,image_path,is_primary',
        ];

        $primaryImage = $product->primary_image_url;

        $variants = $product->variants->map(function ($variant) use ($product, $primaryImage) {
            $variantImage = $product->images->firstWhere('product_variant_id', $variant->id)
                ?? $product->images->firstWhere('is_primary', true)
                ?? $product->images->first();

            $imageUrl = $variantImage?->image_path;

            if ($imageUrl && !Str::startsWith($imageUrl, ['http://', 'https://', '//', '/'])) {
                $imageUrl = Storage::url($imageUrl);
            }

            return [
                'id' => $variant->id,
                'title' => $variant->title,
                'sku' => $variant->sku,
                'size' => $variant->size,
                'color' => $variant->color,
                'material' => $variant->material,
                'price' => $variant->price,
                'compare_at_price' => $variant->compare_at_price,
                'quantity' => $variant->quantity,
                'status' => $variant->status,
                'image' => $imageUrl ?? $primaryImage,
            ];
        })->values();

        $featureList = collect($product->features ?? [])->map(function ($feature) {
            return [
                'name' => $feature['name'] ?? null,
                'type' => $feature['type'] ?? null,
                'icon' => $feature['icon'] ?? null,
            ];
        })->filter(fn ($feature) => $feature['name'])->values();

        $technicalSpecs = collect($product->technical_specs ?? [])->map(function ($spec) {
            return [
                'key' => $spec['key'] ?? null,
                'value' => $spec['value'] ?? null,
            ];
        })->filter(fn ($spec) => $spec['key'] && $spec['value'])->values();

        $modelFeatures = collect($product->model_features ?? [])->map(function ($feature) {
            return [
                'name' => $feature['name'] ?? null,
                'category' => $feature['category'] ?? null,
            ];
        })->filter(fn ($feature) => $feature['name'])->groupBy('category')->map(function ($group, $category) {
            return [
                'category' => $category,
                'items' => $group->pluck('name')->values(),
            ];
        })->values();

        $relatedCategoryIds = $product->categories->pluck('id');

        $similarProductsQuery = Product::with($cardRelationships)
            ->where('id', '!=', $product->id);

        if ($relatedCategoryIds->isNotEmpty()) {
            $similarProductsQuery->whereHas('categories', function ($query) use ($relatedCategoryIds) {
                $query->whereIn('categories.id', $relatedCategoryIds);
            });
        }

        $similarProducts = $similarProductsQuery
            ->orderBy('created_at', 'desc')
            ->take(4)
            ->get();

        if ($similarProducts->count() < 4) {
            $additionalProducts = Product::with($cardRelationships)
                ->where('id', '!=', $product->id)
                ->whereNotIn('id', $similarProducts->pluck('id'))
                ->orderBy('created_at', 'desc')
                ->take(4 - $similarProducts->count())
                ->get();

            $similarProducts = $similarProducts->concat($additionalProducts);
        }

        $similarProducts = $similarProducts->map(function ($similar) {
            return [
                'id' => $similar->id,
                'name' => $similar->name,
                'slug' => $similar->slug,
                'category' => $similar->primary_category,
                'primaryImage' => $similar->primary_image_url,
                'priceRange' => [
                    'min' => $similar->min_price,
                    'max' => $similar->max_price,
                ],
                'compareAtRange' => [
                    'min' => $similar->min_compare_at_price,
                    'max' => $similar->max_compare_at_price,
                ],
                'discount' => [
                    'amount' => $similar->discount_amount,
                    'percentage' => $similar->discount_percentage,
                ],
                'colors' => $similar->color_options,
                'materials' => $similar->material_options,
                'sizes' => $similar->size_options,
                'status' => $similar->status,
            ];
        })->values();

        $payload = [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'description' => $product->description,
            'short_description' => $product->short_description,
            'primaryImage' => $primaryImage,
            'gallery' => $product->images->map(function ($image) {
                $url = $image->image_path;

                if ($url && !Str::startsWith($url, ['http://', 'https://', '//', '/'])) {
                    $url = Storage::url($url);
                }

                return [
                    'id' => $image->id,
                    'url' => $url,
                    'is_primary' => (bool) $image->is_primary,
                    'variant_id' => $image->product_variant_id,
                ];
            })->values(),
            'category' => $product->primary_category,
            'status' => $product->status,
            'sku' => $product->sku,
            'features' => $featureList,
            'technicalSpecs' => $technicalSpecs,
            'modelFeatures' => $modelFeatures,
            'variants' => $variants,
        ];

        return Inertia::render('Web/SingleProduct', [
            'product' => $payload,
            'similarProducts' => $similarProducts,
        ]);
    }
}
