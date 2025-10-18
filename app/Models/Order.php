<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number', 'user_id', 'shipping_address_id', 'billing_address_id', 'status', 'subtotal', 'shipping_cost', 'discount_total', 'total', 'payment_method', 'payment_status'
    ];

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->order_number)) {
                do {
                    $candidate = 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6));
                } while (self::where('order_number', $candidate)->exists());
                $order->order_number = $candidate;
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function shippingAddress()
    {
        return $this->belongsTo(Address::class, 'shipping_address_id');
    }

    public function billingAddress()
    {
        return $this->belongsTo(Address::class, 'billing_address_id');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}


