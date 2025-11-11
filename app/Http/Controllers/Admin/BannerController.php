<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Banner;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BannerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $banners = Banner::orderBy('created_at', 'desc')->get();

        return Inertia::render('Admin/Contents/DynamicBanner', [
            'banners' => $banners
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'status' => 'required|boolean',
            'image' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
        ], [
            'title.required' => 'Banner name is required.',
            'title.max' => 'Banner name cannot exceed 255 characters.',
            'position.required' => 'Position is required.',
            'position.max' => 'Position cannot exceed 255 characters.',
            'status.required' => 'Status is required.',
            'image.required' => 'Banner image is required.',
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'The image must be a JPEG, PNG, JPG, or WEBP file.',
            'image.max' => 'The image size cannot exceed 5MB.',
        ]);

        $data = [
            'title' => $request->title,
            'position' => $request->position,
            'status' => $request->status,
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . Str::slug($request->title) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('banners', $imageName, 'public');
            $data['image'] = $imagePath;
        }

        // If status is active, deactivate all other banners in the same position
        if ($request->status) {
            Banner::where('position', $request->position)
                ->where('status', true)
                ->update(['status' => false]);
        }

        Banner::create($data);

        return redirect()->route('admin.contents.banners.index')
            ->with('success', 'Banner created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $banner = Banner::findOrFail($id);

        $request->validate([
            'title' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'status' => 'required|boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
        ], [
            'title.required' => 'Banner name is required.',
            'title.max' => 'Banner name cannot exceed 255 characters.',
            'position.required' => 'Position is required.',
            'position.max' => 'Position cannot exceed 255 characters.',
            'status.required' => 'Status is required.',
            'image.image' => 'The uploaded file must be an image.',
            'image.mimes' => 'The image must be a JPEG, PNG, JPG, or WEBP file.',
            'image.max' => 'The image size cannot exceed 5MB.',
        ]);

        $data = [
            'title' => $request->title,
            'position' => $request->position,
            'status' => $request->status,
        ];

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($banner->image && Storage::disk('public')->exists($banner->image)) {
                Storage::disk('public')->delete($banner->image);
            }

            $image = $request->file('image');
            $imageName = time() . '_' . Str::slug($request->title) . '.' . $image->getClientOriginalExtension();
            $imagePath = $image->storeAs('banners', $imageName, 'public');
            $data['image'] = $imagePath;
        }

        // If status is active, deactivate all other banners in the same position
        if ($request->status) {
            Banner::where('position', $request->position)
                ->where('status', true)
                ->where('id', '!=', $id)
                ->update(['status' => false]);
        }

        $banner->update($data);

        return redirect()->route('admin.contents.banners.index')
            ->with('success', 'Banner updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $banner = Banner::findOrFail($id);

        // Delete associated image if exists
        if ($banner->image && Storage::disk('public')->exists($banner->image)) {
            Storage::disk('public')->delete($banner->image);
        }

        $banner->delete();

        return redirect()->route('admin.contents.banners.index')
            ->with('success', 'Banner deleted successfully');
    }

    /**
     * Toggle banner status
     */
    public function toggleStatus($id)
    {
        $banner = Banner::findOrFail($id);

        $newStatus = !$banner->status;

        // If activating, deactivate all other banners in the same position
        if ($newStatus) {
            Banner::where('position', $banner->position)
                ->where('status', true)
                ->where('id', '!=', $id)
                ->update(['status' => false]);
        }

        $banner->update(['status' => $newStatus]);

        return redirect()->route('admin.contents.banners.index')
            ->with('success', 'Banner status updated successfully');
    }
}
