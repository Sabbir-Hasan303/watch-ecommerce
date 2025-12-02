<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Product extends Model
{
    use HasFactory;

    protected array $computedAttributesCache = [];

    protected $fillable = [
        'name', 'slug', 'short_description', 'description', 'sku', 'status', 'features', 'technical_specs', 'model_features'
    ];

    protected $casts = [
        'features' => 'array',
        'technical_specs' => 'array',
        'model_features' => 'array',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTimestamps();
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class)->withTimestamps();
    }

    public function featuredProduct()
    {
        return $this->hasOne(FeaturedProduct::class);
    }

    // public function reviews()
    // {
    //     return $this->hasMany(Review::class);
    // }

    public function getPrimaryImageUrlAttribute(): ?string
    {
        $images = $this->relationLoaded('images') ? $this->images : $this->images()->get();

        if ($images->isEmpty()) {
            return null;
        }

        $image = $images->firstWhere('is_primary', true) ?? $images->first();

        if (!$image || !$image->image_path) {
            return null;
        }

        $path = $image->image_path;

        if (Str::startsWith($path, ['http://', 'https://', '//', '/'])) {
            return $path;
        }

        return Storage::url($path);
    }

    public function getPrimaryCategoryAttribute(): string
    {
        $categories = $this->relationLoaded('categories') ? $this->categories : $this->categories()->get();

        return $categories->first()?->name ?? 'Uncategorized';
    }

    public function getMinPriceAttribute(): ?float
    {
        return $this->variantPricingSummary()['min_price'];
    }

    public function getMaxPriceAttribute(): ?float
    {
        return $this->variantPricingSummary()['max_price'];
    }

    public function getMinCompareAtPriceAttribute(): ?float
    {
        return $this->variantPricingSummary()['min_compare_at_price'];
    }

    public function getMaxCompareAtPriceAttribute(): ?float
    {
        return $this->variantPricingSummary()['max_compare_at_price'];
    }

    public function getDiscountPercentageAttribute(): ?float
    {
        return $this->variantPricingSummary()['discount_percentage'];
    }

    public function getDiscountAmountAttribute(): ?float
    {
        return $this->variantPricingSummary()['discount_amount'];
    }

    public function getColorOptionsAttribute(): array
    {
        $variants = $this->relationLoaded('variants') ? $this->variants : $this->variants()->get();

        return $variants->pluck('color')
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    public function getMaterialOptionsAttribute(): array
    {
        $variants = $this->relationLoaded('variants') ? $this->variants : $this->variants()->get();

        return $variants->pluck('material')
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    public function getSizeOptionsAttribute(): array
    {
        $variants = $this->relationLoaded('variants') ? $this->variants : $this->variants()->get();

        return $variants->pluck('size')
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    /**
     * Each variant includes id, color, and image path for color preview on hover
     */
    public function getVariantsWithColorImageMappingAttribute(): array
    {
        $variants = $this->relationLoaded('variants') ? $this->variants : $this->variants()->get();
        $images = $this->relationLoaded('images') ? $this->images : $this->images()->get();

        return $variants->map(function ($variant) use ($images) {
            $variantImage = $images->where('product_variant_id', $variant->id)->first()?->image_path
                         ?? $images->where('is_primary', true)->first()?->image_path
                         ?? $images->first()?->image_path;

            return [
                'id' => $variant->id,
                'color' => $variant->color,
                'image' => $variantImage,
            ];
        })->values()->all();
    }

    protected function variantPricingSummary(): array
    {
        if (isset($this->computedAttributesCache['variant_pricing_summary'])) {
            return $this->computedAttributesCache['variant_pricing_summary'];
        }

        $variants = $this->relationLoaded('variants') ? $this->variants : $this->variants()->get();

        if (!$variants instanceof Collection) {
            $variants = collect($variants);
        }

        $prices = $variants->pluck('price')->filter(fn ($value) => !is_null($value));
        $comparePrices = $variants->pluck('compare_at_price')->filter(fn ($value) => !is_null($value));

        $bestDiscount = $variants
            ->filter(fn ($variant) => $variant->price !== null && $variant->compare_at_price !== null && $variant->compare_at_price > $variant->price)
            ->map(function ($variant) {
                $amount = (float) $variant->compare_at_price - (float) $variant->price;
                $percentage = $variant->compare_at_price > 0 ? ($amount / (float) $variant->compare_at_price) * 100 : 0;

                return [
                    'amount' => round($amount, 2),
                    'percentage' => round($percentage, 2),
                ];
            })
            ->sortByDesc('percentage')
            ->first();

        return $this->computedAttributesCache['variant_pricing_summary'] = [
            'min_price' => $prices->isEmpty() ? null : (float) $prices->min(),
            'max_price' => $prices->isEmpty() ? null : (float) $prices->max(),
            'min_compare_at_price' => $comparePrices->isEmpty() ? null : (float) $comparePrices->min(),
            'max_compare_at_price' => $comparePrices->isEmpty() ? null : (float) $comparePrices->max(),
            'discount_amount' => $bestDiscount['amount'] ?? null,
            'discount_percentage' => $bestDiscount['percentage'] ?? null,
        ];
    }
}


