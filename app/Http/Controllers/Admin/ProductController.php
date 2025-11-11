<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Http\Requests\FeaturedProductRequest;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Services\ProductService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(ProductService $productService)
    {
        $products = $productService->listProducts();
        $categories = Category::all()->pluck('name')->toArray();
        $statuses = ['active', 'draft'];

        return Inertia::render('Admin/Products/List', [
            'products' => $products,
            'categories' => $categories,
            'statuses' => $statuses,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(ProductService $productService)
    {
        $data = $productService->getCreateData();

        return Inertia::render('Admin/Products/Create', $data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request, ProductService $productService)
    {
        try {
            $data = $request->validated();

            // Manually add file uploads to validated data
            if ($request->hasFile('images')) {
                $data['images'] = $request->file('images');
            }

            // Handle variant images
            if (isset($data['variants'])) {
                foreach ($data['variants'] as $index => $variant) {
                    if ($request->hasFile("variants.{$index}.image")) {
                        $data['variants'][$index]['image'] = $request->file("variants.{$index}.image");
                    }
                }
            }

            $productService->createProduct($data);

            return redirect()->route('admin.products.index')
                ->with('success', 'Product created successfully.');

        } catch (\Exception $e) {
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
    public function edit(string $id, ProductService $productService)
    {
        $data = $productService->getEditData($id);

        return Inertia::render('Admin/Products/Edit', [
            'productId' => $id,
            'product' => $data['product'],
            'categories' => $data['categories'],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, string $id, ProductService $productService)
    {
        // dd($request->all());
        try {
            $product = Product::findOrFail($id);

            $data = $request->validated();

            // Manually add file uploads to validated data
            if ($request->hasFile('images')) {
                $data['images'] = $request->file('images');
            }

            // Handle variant images
            if (isset($data['variants'])) {
                foreach ($data['variants'] as $index => $variant) {
                    if ($request->hasFile("variants.{$index}.image")) {
                        $data['variants'][$index]['image'] = $request->file("variants.{$index}.image");
                    }
                }
            }

            $productService->updateProduct($product, $data);

            return redirect()->route('admin.products.index')
                ->with('success', 'Product updated successfully.');

        } catch (\Exception $e) {
            return back()->withInput()
                ->withErrors(['error' => 'Failed to update product: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id, ProductService $productService)
    {
        try {
            $productService->deleteProduct($id);
            return redirect()->route('admin.products.index')
                ->with('success', 'Product deleted successfully.');

        } catch (\Exception $e) {
            return redirect()->route('admin.products.index')
                ->with('error', 'Failed to delete product: ' . $e->getMessage());
        }
    }

    /**
     * Display featured products management page.
     */
    public function featuredIndex(ProductService $productService)
    {
        $products = $productService->listFeaturedProducts();
        $categories = Category::all()->pluck('name')->unique()->values();
        $statusOptions = ['trending', 'featured', 'new-arrival', 'best-seller', 'hot-deal', 'none'];

        return Inertia::render('Admin/Products/FeaturedProduct', [
            'featuredProducts' => $products,
            'categories' => $categories,
            'statusOptions' => $statusOptions,
        ]);
    }

    /**
     * Update a product's featured status.
     */
    public function updateFeatured(FeaturedProductRequest $request, ProductService $productService)
    {
        try {
            $productService->updateFeaturedStatus($request->product_id, $request->status);
            return back()->with('success', 'Product status updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to update featured product: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update product status: ' . $e->getMessage()]);
        }
    }

    /**
     * Bulk update featured product statuses.
     */
    public function bulkUpdateFeatured(Request $request, ProductService $productService)
    {
        $request->validate([
            'product_ids' => 'required|array',
            'product_ids.*' => 'integer|exists:products,id',
            'status' => 'required|string|in:trending,featured,new-arrival,best-seller,hot-deal,none',
        ]);

        try {
            $productService->bulkUpdateFeaturedStatus($request->product_ids, $request->status);
            return back()->with('success', 'Products status updated successfully.');
        } catch (\Exception $e) {
            Log::error('Failed to bulk update featured products: ' . $e->getMessage());
            return back()->withErrors(['error' => 'Failed to update products status: ' . $e->getMessage()]);
        }
    }
}

