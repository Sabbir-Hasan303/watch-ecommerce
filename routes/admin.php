<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\AdminProfileController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\ContactController;



Route::middleware(['auth', 'verified', 'admin'])->group(function () {
    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('admin.dashboard');

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

            // Featured Products
            Route::get('/featured-products', [ProductController::class, 'featuredIndex'])->name('admin.products.featured-products');
            Route::put('/featured-products/update', [ProductController::class, 'updateFeatured'])->name('admin.products.featured.update');
            Route::post('/featured-products/bulk-update', [ProductController::class, 'bulkUpdateFeatured'])->name('admin.products.featured.bulk-update');
        });

        // Orders
        Route::prefix('orders')->group(function () {
            Route::get('/', [OrderController::class, 'index'])->name('admin.orders.index');
            Route::get('/create', [OrderController::class, 'create'])->name('admin.orders.create');
            Route::post('/store', [OrderController::class, 'store'])->name('admin.orders.store');
            Route::get('/{id}/details', [OrderController::class, 'show'])->name('admin.orders.show');
            Route::get('/{id}/edit', [OrderController::class, 'edit'])->name('admin.orders.edit');
            Route::post('/update', [OrderController::class, 'update'])->name('admin.orders.update');
            Route::get('/{id}/invoice', [OrderController::class, 'downloadInvoice'])->name('admin.orders.invoice');
            Route::post('/change-status', [OrderController::class, 'changeOrderStatus'])->name('admin.orders.change-status');
            Route::post('/cancel', [OrderController::class, 'cancelOrder'])->name('admin.orders.cancel');
        });

        // Customers
        Route::prefix('customers')->group(function () {
            Route::get('/', [CustomerController::class, 'index'])->name('admin.customers.index');

            Route::get('/{id}/orders', [CustomerController::class, 'allOrders'])->name('admin.customers.orders');

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

        Route::get('/contact-list', [ContactController::class, 'list'])->name('admin.contents.contact-list');
        Route::post('/contact-list/mark-as-replied', [ContactController::class, 'markAsReplied'])->name('admin.contents.contact-list.mark-as-replied');

        Route::get('/faqs', function () {
            return Inertia::render('Admin/Contents/FaqList');
        })->name('admin.contents.faqs');

        Route::get('/dynamic-banner', function () {
            return Inertia::render('Admin/Contents/DynamicBanner');
        })->name('admin.contents.dynamic-banner');

        Route::prefix('settings')->group(function () {
            Route::get('/profile', [AdminProfileController::class, 'index'])->name('admin.settings.profile');
            Route::put('/profile', [AdminProfileController::class, 'update'])->name('admin.settings.profile.update');
            Route::post('/profile/image', [AdminProfileController::class, 'updateProfileImage'])->name('admin.settings.profile.image');
        });
    });
});

require __DIR__ . '/auth.php';
