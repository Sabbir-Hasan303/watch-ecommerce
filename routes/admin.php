<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Products
    Route::prefix('products')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Products/List');
        })->name('admin.products.index');

        Route::get('/create', function () {
            return Inertia::render('Admin/Products/Create');
        })->name('admin.products.create');

        Route::get('/edit/{id}', function ($id) {
            return Inertia::render('Admin/Products/Edit', [
                'productId' => $id
            ]);
        })->name('admin.products.edit');

        Route::get('/categories', function () {
            return Inertia::render('Admin/Products/Categories');
        })->name('admin.products.categories');
    });

    // Orders
    Route::prefix('orders')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Orders/List');
        })->name('admin.orders.index');
    });
});

require __DIR__ . '/auth.php';
