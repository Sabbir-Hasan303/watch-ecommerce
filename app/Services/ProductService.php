<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Category;
use App\Models\FeaturedProduct;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductService
{
    /**
     * Get list of products with formatted data for display.
     */
    public function listProducts(): array
    {
        return Product::with(['categories', 'variants', 'images'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'status' => $product->status,
                    'categories' => $product->categories->pluck('name')->toArray(),
                    'primary_category' => $product->categories->first()?->name ?? 'Uncategorized',
                    'variants_count' => $product->variants->count(),
                    'total_stock' => $product->variants->sum('quantity'),
                    'min_price' => $product->variants->count() > 0 ? $product->variants->min('price') : null,
                    'max_price' => $product->variants->count() > 0 ? $product->variants->max('price') : null,
                    'primary_image' => $product->images->where('is_primary', true)->first()?->image_path ?? $product->images->first()?->image_path,
                    'created_at' => $product->created_at,
                    'updated_at' => $product->updated_at,
                ];
            })
            ->toArray();
    }

    /**
     * Get data needed for create form.
     */
    public function getCreateData(): array
    {
        return [
            'categories' => Category::all(),
        ];
    }

    /**
     * Create a new product with all its relations.
     */
    public function createProduct(array $data): Product
    {
        DB::beginTransaction();

        try {
            // Create the product
            $product = Product::create([
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'short_description' => $data['short_description'] ?? null,
                'description' => $data['description'] ?? null,
                'sku' => $data['sku'],
                'status' => $data['status'],
                'features' => $data['features'] ?? [],
                'technical_specs' => $data['technical_specs'] ?? [],
                'model_features' => $data['model_features'] ?? [],
            ]);

            // Attach categories
            $product->categories()->attach($data['categories']);

            // Handle product images
            if (!empty($data['images'])) {
                foreach ($data['images'] as $index => $image) {
                    $path = $image->store('products/' . $product->id, 'public');

                    $product->images()->create([
                        'image_path' => $path,
                        'is_primary' => $index === 0,
                        'product_variant_id' => null,
                    ]);
                }
            }

            // Create product variants
            foreach ($data['variants'] as $variantData) {
                $this->createVariant($product, $variantData);
            }

            DB::commit();

            return $product->fresh(['categories', 'variants', 'images']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create product: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Get formatted product data for edit form.
     */
    public function getEditData(string $id): array
    {
        $product = Product::with(['categories:id,name', 'images:id,product_id,image_path,is_primary,product_variant_id', 'variants'])
            ->findOrFail($id);

        return [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'short_description' => $product->short_description,
                'sku' => $product->sku,
                'status' => $product->status,
                'features' => $product->features ?? [],
                'technical_specs' => $product->technical_specs ?? [],
                'model_features' => $product->model_features ?? [],
                'categories' => $product->categories->map(fn ($c) => ['id' => $c->id, 'name' => $c->name])->values(),
                'images' => $product->images->map(function ($img) {
                    return [
                        'id' => $img->id,
                        'url' => $img->image_path ? Storage::url($img->image_path) : null,
                        'image_path' => $img->image_path,
                        'is_primary' => (bool) $img->is_primary,
                        'product_variant_id' => $img->product_variant_id,
                    ];
                })->values(),
                'variants' => $product->variants->map(function ($v) use ($product) {
                    $linkedImage = $product->images->firstWhere('product_variant_id', $v->id);
                    return [
                        'id' => $v->id,
                        'title' => $v->title,
                        'variant_name' => $v->title,
                        'sku' => $v->sku,
                        'size' => $v->size,
                        'color' => $v->color,
                        'material' => $v->material,
                        'price' => $v->price,
                        'compare_at_price' => $v->compare_at_price,
                        'quantity' => $v->quantity,
                        'stock_quantity' => $v->quantity,
                        'status' => $v->status,
                        'image' => $linkedImage ? [
                            'id' => $linkedImage->id,
                            'url' => $linkedImage->image_path ? Storage::url($linkedImage->image_path) : null,
                            'image_path' => $linkedImage->image_path,
                        ] : null,
                    ];
                })->values(),
            ],
            'categories' => Category::all(['id', 'name']),
        ];
    }

    /**
     * Delete a product and all its relations.
     */
    public function deleteProduct(string $id): void
    {
        DB::beginTransaction();

        try {
            $product = Product::with('images')->findOrFail($id);

            // Delete all associated images from storage
            foreach ($product->images as $image) {
                if ($image->image_path && Storage::disk('public')->exists($image->image_path)) {
                    Storage::disk('public')->delete($image->image_path);
                }
            }

            // Delete variants, categories, and product
            $product->variants()->delete();
            $product->categories()->detach();
            $product->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to delete product: ' . $e->getMessage(), [
                'product_id' => $id,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Get list of featured products.
     */
    public function listFeaturedProducts(): array
    {
        return Product::with(['categories', 'variants', 'images', 'featuredProduct'])
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'category' => $product->categories->first()?->name ?? 'Uncategorized',
                    'price' => $product->variants->count() > 0 ? $product->variants->first()->price : 0,
                    'stock' => $product->variants->sum('quantity'),
                    'status' => $product->featuredProduct?->status ?? 'none',
                    'image' => $product->images->where('is_primary', true)->first()?->image_path ?? $product->images->first()?->image_path,
                    'created_at' => $product->created_at,
                    'updated_at' => $product->updated_at,
                ];
            })
            ->toArray();
    }

    /**
     * Update a single product's featured status.
     */
    public function updateFeaturedStatus(int $productId, string $status): void
    {
        FeaturedProduct::updateOrCreate(
            ['product_id' => $productId],
            ['status' => $status]
        );
    }

    /**
     * Bulk update featured product statuses.
     */
    public function bulkUpdateFeaturedStatus(array $productIds, string $status): void
    {
        foreach ($productIds as $productId) {
            $this->updateFeaturedStatus($productId, $status);
        }
    }

    /**
     * Update an existing product with all its relations.
     */
    public function updateProduct(Product $product, array $data): Product
    {
        DB::beginTransaction();

        try {
            // Update basic product info
            $this->updateBasicInfo($product, $data);

            // Sync categories
            $this->syncCategories($product, $data['categories'] ?? []);

            // Handle product images
            $this->handleProductImages($product, $data);

            // Handle deleted variants
            $this->deleteVariants($product, $data['deleted_variant_ids'] ?? []);

            // Handle variants (update existing or create new)
            $this->handleVariants($product, $data['variants'] ?? []);

            DB::commit();

            return $product->fresh(['categories', 'variants', 'images']);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update product: ' . $e->getMessage(), [
                'product_id' => $product->id,
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Update basic product information.
     */
    protected function updateBasicInfo(Product $product, array $data): void
    {
        $product->update([
            'name' => $data['name'],
            'slug' => Str::slug($data['name']),
            'short_description' => $data['short_description'] ?? null,
            'description' => $data['description'] ?? null,
            'sku' => $data['sku'],
            'status' => $data['status'],
            'features' => $data['features'] ?? [],
            'technical_specs' => $data['technical_specs'] ?? [],
            'model_features' => $data['model_features'] ?? [],
        ]);
    }

    /**
     * Sync product categories.
     */
    protected function syncCategories(Product $product, array $categoryIds): void
    {
        $product->categories()->sync($categoryIds);
    }

    /**
     * Handle product images (keep existing, add new).
     */
    protected function handleProductImages(Product $product, array $data): void
    {
        $existingImageIds = $data['existing_image_ids'] ?? [];

        // Delete images not in the keep list
        if (!empty($existingImageIds)) {
            $product->images()->whereNull('product_variant_id')->whereNotIn('id', $existingImageIds)->delete();
        } else {
            $product->images()->whereNull('product_variant_id')->delete();
        }

        // Upload and save new images
        if (!empty($data['images'])) {
            foreach ($data['images'] as $index => $image) {
                $path = $image->store('products/' . $product->id, 'public');

                $product->images()->create([
                    'image_path' => $path,
                    'is_primary' => $index === 0 && empty($existingImageIds),
                    'product_variant_id' => null,
                ]);
            }
        }
    }

    /**
     * Delete variants that were explicitly marked for deletion.
     */
    protected function deleteVariants(Product $product, array $deletedVariantIds): void
    {
        if (empty($deletedVariantIds)) {
            return;
        }

        $product->variants()
            ->whereIn('id', $deletedVariantIds)
            ->each(function ($variant) {
                // Delete associated images first
                $variant->images()->delete();
                $variant->delete();
            });
    }

    /**
     * Handle variants (update existing or create new).
     */
    protected function handleVariants(Product $product, array $variants): void
    {
        foreach ($variants as $variantData) {
            if (!empty($variantData['id'])) {
                $this->updateVariant($product, $variantData);
            } else {
                $this->createVariant($product, $variantData);
            }
        }
    }

    /**
     * Update an existing variant.
     */
    protected function updateVariant(Product $product, array $data): void
    {
        $variant = $product->variants()->find($data['id']);

        if (!$variant) {
            Log::warning("Variant {$data['id']} not found for product {$product->id}");
            return;
        }

        $variant->update([
            'title' => $data['title'],
            'sku' => $data['sku'],
            'size' => $data['size'] ?? null,
            'color' => $data['color'] ?? null,
            'material' => $data['material'] ?? null,
            'price' => $data['price'],
            'compare_at_price' => $data['compare_at_price'] ?? null,
            'quantity' => $data['quantity'],
            'status' => $data['status'],
        ]);

        $this->handleVariantImage($product, $variant, $data);
    }

    /**
     * Create a new variant.
     */
    protected function createVariant(Product $product, array $data): void
    {
        $variant = $product->variants()->create([
            'title' => $data['title'],
            'sku' => $data['sku'],
            'size' => $data['size'] ?? null,
            'color' => $data['color'] ?? null,
            'material' => $data['material'] ?? null,
            'price' => $data['price'],
            'compare_at_price' => $data['compare_at_price'] ?? null,
            'quantity' => $data['quantity'],
            'status' => $data['status'],
        ]);

        $this->handleVariantImage($product, $variant, $data);
    }

    /**
     * Handle variant image (new upload or existing image).
     */
    protected function handleVariantImage(Product $product, $variant, array $data): void
    {
        // New image uploaded
        if (!empty($data['image'])) {
            // Delete old variant images first
            $variant->images()->delete();

            // Upload and save new image
            $variantImagePath = $data['image']->store('products/' . $product->id . '/variants', 'public');
            $product->images()->create([
                'image_path' => $variantImagePath,
                'is_primary' => false,
                'product_variant_id' => $variant->id,
            ]);
        }
        // Link existing image
        elseif (!empty($data['existing_image_id'])) {
            $product->images()
                ->where('id', $data['existing_image_id'])
                ->update(['product_variant_id' => $variant->id]);
        }
        // Otherwise, keep existing images as-is
    }
}

