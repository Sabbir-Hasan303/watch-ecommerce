<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Option extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
    ];

    /**
     * Get option value by key
     */
    public static function getValue($key, $default = null)
    {
        $option = static::where('key', $key)->first();

        if (!$option) {
            return $default;
        }

        // Try to decode as JSON, if it fails return as string
        $decoded = json_decode($option->value, true);
        return $decoded !== null ? $decoded : $option->value;
    }

    /**
     * Set option value by key
     */
    public static function setValue($key, $value)
    {
        $option = static::where('key', $key)->first();

        if (!$option) {
            $option = new static();
            $option->key = $key;
        }

        // If value is array/object, encode as JSON, otherwise store as string
        $option->value = is_array($value) || is_object($value) ? json_encode($value) : (string) $value;
        $option->save();

        return $option;
    }
}
