<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user()->load('addresses');

        $totalOrders = $user->orders()->count();
        $addresses = $user->addresses;

        $defaultAddress = $addresses->where('is_default', true)->first() ?? $addresses->first();
        $defaultAddressText = $defaultAddress
            ? collect([
                $defaultAddress->full_name,
                $defaultAddress->address_line,
                $defaultAddress->area === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka',
                $defaultAddress->phone,
            ])->filter()->implode(', ')
            : null;

        $recentOrders = $user->orders()
            ->latest()
            ->take(5)
            ->get(['id', 'order_number', 'status', 'total', 'created_at'])
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'orderNumber' => $order->order_number,
                    'status' => $order->status,
                    'total' => (float) $order->total,
                    'placedAt' => optional($order->created_at)->toIso8601String(),
                ];
            });

        return Inertia::render('Customer/Dashboard', [
            'stats' => [
                'totalOrders' => $totalOrders,
                'savedAddresses' => $addresses->count(),
                'accountStatus' => 'Active',
            ],
            'account' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'defaultAddress' => $defaultAddressText,
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}


