<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

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
    });
});

require __DIR__ . '/auth.php';
