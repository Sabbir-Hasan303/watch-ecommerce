<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    public function index()
    {
        $customers = User::where('role', 'customer')->with(['addresses'])->get()
            ->map(function ($customer) {

                // Get primary address for location
                $primaryAddress = $customer->addresses->where('is_default', true)->first() ?? $customer->addresses->first();

                $address = $primaryAddress ? ($primaryAddress->address_line) : 'No address provided';
                $area = $primaryAddress ? ($primaryAddress->area == 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka') : 'No area provided';
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'address' => $address,
                    'area' => $area,
                    'joinDate' => $customer->created_at,
                    'totalOrders' => $customer->total_orders,
                    'totalSpent' => $customer->total_spent,
                ];
            });

        return Inertia::render('Admin/Customers/List', [
            'customers' => $customers
        ]);
    }

    public function allOrders($id)
    {
        $customer = User::where('role', 'customer')
            ->with(['orders.items.product', 'orders', 'addresses'])
            ->findOrFail($id);

        // Calculate totals explicitly
        $totalOrders = $customer->orders->count();
        $totalSpent = $customer->orders->where('status', 'delivered')->sum('total');

        return Inertia::render('Admin/Customers/CustomerOrders', [
            'customer' => $customer,
            'totalOrders' => $totalOrders,
            'totalSpent' => $totalSpent
        ]);
    }
}
