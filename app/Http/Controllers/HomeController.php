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

        // Fetch trending products with their variants and image data
        $trendingProducts = FeaturedProduct::where('status', 'trending')
            ->with(['product.categories', 'product.images', 'product.variants'])
            ->limit(8)
            ->get()
            ->map(function ($featured) {
                $product = $featured->product;
                $variants = $product->variants;

                // Calculate price range
                $prices = $variants->pluck('price')->filter()->sort()->values();
                $minPrice = $prices->first();
                $maxPrice = $prices->last();

                // Get first variant for display attributes
                $firstVariant = $variants->first();

                return [
                    'id' => $product->id,
                    'product_id' => $product->id,
                    'slug' => $product->slug,
                    'name' => $product->name,
                    'brand' => $product->categories->first()?->name ?? 'Watch',
                    'image' => $product->images->where('is_primary', true)->first()?->image_path
                           ?? $product->images->first()?->image_path,
                    'caseDiameter' => $firstVariant?->size ?? 'N/A',
                    'caseMaterial' => $firstVariant?->material ?? 'N/A',
                    'color' => $firstVariant?->color ?? '#1f2937',
                    'minPrice' => $minPrice,
                    'maxPrice' => $maxPrice,
                ];
            });

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
