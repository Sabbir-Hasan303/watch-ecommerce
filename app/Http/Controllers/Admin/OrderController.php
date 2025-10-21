<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        // $orders = Order::all();
        // return Inertia::render('Admin/Orders/List', [
        //     'orders' => $orders
        // ]);
        return Inertia::render('Admin/Orders/List');
    }

    public function create()
    {
        return Inertia::render('Admin/Orders/CreateOrder');
    }
}
