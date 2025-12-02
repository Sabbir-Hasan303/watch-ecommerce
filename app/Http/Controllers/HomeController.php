<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Category;
use App\Models\FeaturedProduct;
use App\Models\Banner;

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::limit(5)->get();

        // Get active Homepage Hero banner
        $banner = Banner::where('position', 'Homepage Hero')
            ->where('status', true)
            ->first();

        // Fetch trending products with variants and images for color preview
        $trendingProducts = FeaturedProduct::where('status', 'trending')
            ->with(['product.categories:id,name', 'product.variants:id,product_id,color,material,size,status', 'product.images:id,product_id,product_variant_id,image_path,is_primary'])
            ->limit(8)
            ->get()
            ->map(function ($featured) {
                $product = $featured->product;
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
                    'variants' => $product->variants_with_color_image_mapping,
                ];
            })
            ->values();

        return Inertia::render('Web/Home', [
            'categories' => $categories,
            'trendingProducts' => $trendingProducts,
            'banner' => $banner,
        ]);
    }

    public function about(){
        return Inertia::render('Web/AboutUs');
    }
}
