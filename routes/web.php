<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WebProductController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
    return Inertia::render('Web/Home');
});

// Route::get('/watches', function () {
//     return Inertia::render('Web/ProductList');
// })->name('watches-list');

Route::get('/watches', [WebProductController::class, 'productList'])->name('watches-list');

Route::get('/watches/{slug}', [WebProductController::class, 'singleProduct'])->name('single-product');

Route::prefix('cart')->group(function () {
    Route::get('/', [CartController::class, 'show'])->name('cart.show');
    Route::post('/items', [CartController::class, 'store'])->name('cart.items.store');
    Route::patch('/items/{cartItem}', [CartController::class, 'update'])->name('cart.items.update');
    Route::delete('/items/{cartItem}', [CartController::class, 'destroy'])->name('cart.items.destroy');
    Route::delete('/', [CartController::class, 'clear'])->name('cart.clear');
});

Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/terms', function () {
    return Inertia::render('Web/Terms');
})->name('terms');

Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/orders/{order}/confirmation', [CheckoutController::class, 'show'])->name('order.confirmation');


// Customer Routes
Route::middleware(['auth', 'verified', 'customer'])->group(function () {
    Route::get('/customer/dashboard', function () {
        $user = Auth::user();
        return Inertia::render('Customer/Dashboard', [
            'user' => $user,
        ]);
    })->name('customer.dashboard');

    Route::get('/customer/profile', function () {
        $user = Auth::user();
        return Inertia::render('Customer/Profile', [
            'user' => $user,
        ]);
    })->name('customer.profile');

    Route::get('/customer/orders', function () {
        return Inertia::render('Customer/Orders');
    })->name('customer.orders');

    Route::get('/customer/orders/{order}', function ($order) {
        return Inertia::render('Customer/ShowOrder', [
            'order' => $order,
        ]);
    })->name('customer.orders.show');

    Route::get('/customer/logout', function () {
        Auth::logout();
        return redirect()->route('login');
    })->name('customer.logout');

});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
