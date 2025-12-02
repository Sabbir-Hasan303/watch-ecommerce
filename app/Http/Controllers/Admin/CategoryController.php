<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')->get();

        return Inertia::render('Admin/Products/Categories', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp,ico|max:5120', // 5MB max
        ], [
            'name.required' => 'Category name is required.',
            'name.string' => 'Category name must be a valid text.',
            'name.max' => 'Category name cannot exceed 255 characters.',
            'name.unique' => 'A category with this name already exists.',
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'The image must be a JPEG, PNG, WEBP, or ICO file.',
            'image.max' => 'The image size cannot exceed 5MB.',
        ]);

        $data = [
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . Str::slug($request->name) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('categories', $imageName, 'public');
            $data['image_path'] = $imagePath;
        }

        $category = Category::create($data);

        return redirect()->route('admin.products.categories')
            ->with('success', 'Category created successfully');
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $id,
            'image' => 'nullable|image|mimes:jpeg,jpg,png,webp,ico|max:5120', // 5MB max
        ], [
            'name.required' => 'Category name is required.',
            'name.string' => 'Category name must be a valid text.',
            'name.max' => 'Category name cannot exceed 255 characters.',
            'name.unique' => 'A category with this name already exists.',
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'The image must be a JPEG, PNG, WEBP, or ICO file.',
            'image.max' => 'The image size cannot exceed 5MB.',
        ]);

        $data = [
            'name' => $request->name,
            'slug' => Str::slug($request->name),
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($category->image_path && Storage::disk('public')->exists($category->image_path)) {
                Storage::disk('public')->delete($category->image_path);
            }

            $image = $request->file('image');
            $imageName = time() . '_' . Str::slug($request->name) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('categories', $imageName, 'public');
            $data['image_path'] = $imagePath;
        }

        $category->update($data);

        return redirect()->route('admin.products.categories')
            ->with('success', 'Category updated successfully');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        // Delete associated image if exists
        if ($category->image_path && Storage::disk('public')->exists($category->image_path)) {
            Storage::disk('public')->delete($category->image_path);
        }

        $category->delete();

        return redirect()->route('admin.products.categories')
            ->with('success', 'Category deleted successfully');
    }
}
