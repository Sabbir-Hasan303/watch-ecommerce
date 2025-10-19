<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['categories', 'variants', 'images'])
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
            });

        $categories = Category::all()->pluck('name')->toArray();
        $statuses = ['active', 'draft'];

        return Inertia::render('Admin/Products/List', [
            'products' => $products,
            'categories' => $categories,
            'statuses' => $statuses,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::all();

        return Inertia::render('Admin/Products/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'short_description' => 'nullable|string',
            'description' => 'nullable|string',
            'sku' => 'required|string|unique:products,sku',
            'status' => 'required|in:active,draft',
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:categories,id',
            'features' => 'nullable|array',
            'features.*.name' => 'required|string',
            'features.*.type' => 'required|string',
            'features.*.icon' => 'nullable|string',
            'technical_specs' => 'nullable|array',
            'technical_specs.*.key' => 'required|string',
            'technical_specs.*.value' => 'required|string',
            'model_features' => 'nullable|array',
            'model_features.*.name' => 'required|string',
            'model_features.*.category' => 'nullable|string',
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
            // 'variants.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'images' => 'nullable|array',
            // 'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:10240', // 10MB max
        ]);

        // If validation fails, return with errors
        if ($validator->fails()) {
            Log::error('Validation errors: ' . $validator->errors()->toJson());
            return back()->withInput()
                ->withErrors($validator->errors());
        }

        // Get validated data
        $validated = $validator->validated();

        try {
            DB::beginTransaction();

            // Generate slug from name
            $slug = Str::slug($request->name);

            // Create the product
            $product = Product::create([
                'name' => $request->name,
                'slug' => $slug,
                'short_description' => $request->short_description ?? null,
                'description' => $request->description ?? null,
                'sku' => $request->sku,
                'status' => $request->status,
                'features' => $request->features ?? [],
                'technical_specs' => $request->technical_specs ?? [],
                'model_features' => $request->model_features ?? [],
            ]);

            // Attach categories (now required)
            $product->categories()->attach($request->categories);

            // Handle product images
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $path = $image->store('products/' . $product->id, 'public');

                    $product->images()->create([
                        'image_path' => $path,
                        'is_primary' => $index === 0, // First image is primary
                        'product_variant_id' => null, // This is a product image, not variant image
                    ]);
                }
            }

            // Create product variants
            foreach ($request->variants as $variantData) {
                $variant = $product->variants()->create([
                    'title' => $variantData['title'],
                    'sku' => $variantData['sku'],
                    'size' => $variantData['size'] ?? null,
                    'color' => $variantData['color'] ?? null,
                    'material' => $variantData['material'] ?? null,
                    'price' => $variantData['price'],
                    'compare_at_price' => $variantData['compare_at_price'] ?? null,
                    'quantity' => $variantData['quantity'],
                    'status' => $variantData['status'],
                ]);

                // Handle variant images if provided
                if (isset($variantData['image']) && $variantData['image']) {
                    $variantImagePath = $variantData['image']->store('products/' . $product->id . '/variants', 'public');

                    // Store variant image in product_images table
                    $product->images()->create([
                        'image_path' => $variantImagePath,
                        'is_primary' => false,
                        'product_variant_id' => $variant->id, // Link to specific variant
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('admin.products.index')
                ->with('success', 'Product created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create product: ' . $e->getMessage());

            return back()->withInput()
                ->withErrors(['error' => 'Failed to create product: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        // return Inertia::render('Admin/Products/Edit', [
        //     'productId' => $id,
        // ]);
        return Inertia::render('Admin/Products/Edit', [
            'productId' => $id,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
