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

        Route::get('/tags', function () {
            return Inertia::render('Admin/Products/Tags');
        })->name('admin.products.tags');

        Route::get('/featured', function () {
            return Inertia::render('Admin/Products/FeaturedProductPage');
        })->name('admin.products.featured');
    });

    // Orders
    Route::prefix('orders')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Orders/List');
        })->name('admin.orders.index');

        Route::get('/{id}', function ($id) {
            return Inertia::render('Admin/Orders/ViewOrder', [
                'orderId' => $id
            ]);
        })->name('admin.orders.view');
    });

    // Customers
    Route::prefix('customers')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Admin/Customers/List');
        })->name('admin.customers.index');

        Route::get('/ratings', function () {
            return Inertia::render('Admin/Customers/Ratings');
        })->name('admin.customers.ratings');

        Route::get('/reviews', function () {
            return Inertia::render('Admin/Customers/Reviews');
        })->name('admin.customers.reviews');
    });

    // Contents
    Route::get('/newsletters', function () {
        return Inertia::render('Admin/Contents/Newsletters');
    })->name('admin.contents.newsletters');

    Route::get('/contact-list', function () {
        return Inertia::render('Admin/Contents/ContactList');
    })->name('admin.contents.contact-list');

    Route::get('/faqs', function () {
        return Inertia::render('Admin/Contents/FaqList');
    })->name('admin.contents.faqs');

    Route::get('/dynamic-banner', function () {
        return Inertia::render('Admin/Contents/DynamicBanner');
    })->name('admin.contents.dynamic-banner');
});

require __DIR__ . '/auth.php';
