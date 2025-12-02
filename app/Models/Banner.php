<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Banner extends Model
{
    protected $fillable = [
        'title',
        'position',
        'status',
        'image',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    protected $appends = [
        'image_url',
    ];

    /**
     * Get the full URL for the banner image
     */
    public function getImageUrlAttribute()
    {
        if ($this->image) {
            return Storage::url($this->image);
        }
        return null;
    }

    /**
     * Scope to get only active banners
     */
    public function scopeActive($query)
    {
        return $query->where('status', true);
    }

    /**
     * Scope to filter by position
     */
    public function scopePosition($query, $position)
    {
        return $query->where('position', $position);
    }
}
