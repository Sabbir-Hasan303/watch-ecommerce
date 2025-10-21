<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;



Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Products
    Route::prefix('products')->group(function () {

        Route::get('/', [ProductController::class, 'index'])->name('admin.products.index');
        Route::get('/create', [ProductController::class, 'create'])->name('admin.products.create');
        Route::get('/edit/{id}', [ProductController::class, 'edit'])->name('admin.products.edit');

        Route::post('/', [ProductController::class, 'store'])->name('admin.products.store');
        Route::put('/{id}', [ProductController::class, 'update'])->name('admin.products.update');
        Route::delete('/{id}', [ProductController::class, 'destroy'])->name('admin.products.destroy');

        Route::get('/categories', [CategoryController::class, 'index'])->name('admin.products.categories');
        Route::post('/categories', [CategoryController::class, 'store'])->name('admin.products.categories.store');
        Route::put('/categories/{id}', [CategoryController::class, 'update'])->name('admin.products.categories.update');
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy'])->name('admin.products.categories.destroy');

        Route::get('/tags', function () {
            return Inertia::render('Admin/Products/Tags');
        })->name('admin.products.tags');

        Route::get('/featured', function () {
            return Inertia::render('Admin/Products/FeaturedProductPage');
        })->name('admin.products.featured');
    });

    // Orders
    Route::prefix('orders')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('admin.orders.index');
        Route::get('/create', [OrderController::class, 'create'])->name('admin.orders.create');

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

        Route::get('/{id}/orders', function ($id) {
            return Inertia::render('Admin/Customers/CustomerOrders', [
                'customerId' => $id
            ]);
        })->name('admin.customers.orders');

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

    Route::prefix('settings')->group(function () {
        Route::get('/profile', function () {
            return Inertia::render('Admin/Settings/Profile');
        })->name('admin.settings.profile');
    });
});

require __DIR__ . '/auth.php';
