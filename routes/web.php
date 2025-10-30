<?php

use App\Http\Controllers\ProfileController;
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

Route::get('/watches', function () {
    return Inertia::render('Web/ProductList');
})->name('watches-list');

Route::get('/watches/{id}', function () {
    return Inertia::render('Web/SingleProduct');
})->name('single-product');

Route::get('/contact', function () {
    return Inertia::render('Web/Contact');
})->name('contact');

Route::get('/terms', function () {
    return Inertia::render('Web/Terms');
})->name('terms');

Route::get('/checkout', function () {
    return Inertia::render('Web/Checkout');
})->name('checkout');


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
