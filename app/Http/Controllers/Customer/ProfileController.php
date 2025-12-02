<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user()->load('addresses');

        $addresses = $user->addresses()
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($address) {
                return [
                    'id' => $address->id,
                    'full_name' => $address->full_name,
                    'phone' => $address->phone,
                    'address_line' => $address->address_line,
                    'area' => $address->area,
                    'area_label' => $address->area === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka',
                    'is_default' => (bool) $address->is_default,
                    'created_at' => optional($address->created_at)->toIso8601String(),
                ];
            })
            ->values();

        return Inertia::render('Customer/Profile', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'profile_image' => $user->profile_image,
            ],
            'addresses' => $addresses,
            'areaOptions' => [
                ['value' => 'inside_dhaka', 'label' => 'Inside Dhaka'],
                ['value' => 'outside_dhaka', 'label' => 'Outside Dhaka'],
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:32'],
        ]);

        $user->forceFill($validated)->save();

        return Redirect::back()->with('success', 'Profile updated successfully.');
    }

    public function updateImage(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'profile_image' => ['required', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
        ]);

        if ($user->profile_image && Storage::disk('public')->exists($user->profile_image)) {
            Storage::disk('public')->delete($user->profile_image);
        }

        $path = $validated['profile_image']->store('profile-images', 'public');

        $user->forceFill(['profile_image' => $path])->save();

        return Redirect::back()->with('success', 'Profile image updated successfully.');
    }
}


