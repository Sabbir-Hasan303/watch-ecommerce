<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class AdminProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        return Inertia::render('Admin/Settings/Profile', [
            'user' => $user
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        // Handle profile information update
        if ($request->has('name') || $request->has('email')) {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            ]);

            $user->update($validated);
        }

        // Handle password update
        if ($request->has('current_password') && $request->has('password')) {
            $validated = $request->validate([
                'current_password' => 'required|string',
                'password' => 'required|string|min:8|confirmed',
            ]);

            // Check if current password is correct
            if (!Hash::check($validated['current_password'], $user->password)) {
                return redirect()->back()->with('error', 'The current password is incorrect.');
            }

            $user->update([
                'password' => Hash::make($validated['password'])
            ]);
        }

        return redirect()->route('admin.settings.profile')->with('success', 'Profile updated successfully');
    }

    public function updateProfileImage(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'profile_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Delete old profile image if exists
        if ($user->profile_image) {
            $oldImagePath = $user->profile_image;
            if (Storage::disk('public')->exists($oldImagePath)) {
                Storage::disk('public')->delete($oldImagePath);
            }
        }

        // Store new profile image
        $imagePath = $validated['profile_image']->store('profile-images', 'public');
        $user->update(['profile_image' => $imagePath]);

        return redirect()->route('admin.settings.profile')->with('success', 'Profile image updated successfully');
    }
}
