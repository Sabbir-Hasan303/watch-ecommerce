<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use App\Models\Category;

class HomeController extends Controller
{
    public function index()
    {
        $categories = Category::limit(5)->get();

        return Inertia::render('Web/Home', [
            'categories' => $categories,
        ]);
    }
}
