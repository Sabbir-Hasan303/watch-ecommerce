<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class AddressController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'full_name' => ['nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
            'address_line' => ['required', 'string', 'max:255'],
            'area' => ['required', Rule::in(['inside_dhaka', 'outside_dhaka'])],
            'is_default' => ['sometimes', 'boolean'],
        ]);

        $shouldBeDefault = (bool) ($validated['is_default'] ?? false);

        $address = $user->addresses()->create([
            'full_name' => $validated['full_name'] ?? null,
            'phone' => $validated['phone'],
            'address_line' => $validated['address_line'],
            'area' => $validated['area'],
            'is_default' => false,
        ]);

        if ($shouldBeDefault || !$user->addresses()->where('id', '!=', $address->id)->where('is_default', true)->exists()) {
            $this->markAsDefault($user, $address);
        }

        return Redirect::back()->with('success', 'Address added successfully.');
    }

    public function destroy(Request $request, Address $address): RedirectResponse
    {
        $user = $request->user();

        abort_unless($address->user_id === $user->id, 403);

        $wasDefault = (bool) $address->is_default;
        $address->delete();

        if ($wasDefault) {
            $next = $user->addresses()->first();
            if ($next) {
                $this->markAsDefault($user, $next);
            }
        }

        return Redirect::back()->with('success', 'Address removed successfully.');
    }

    public function setDefault(Request $request, Address $address): RedirectResponse
    {
        $user = $request->user();

        abort_unless($address->user_id === $user->id, 403);

        $this->markAsDefault($user, $address);

        return Redirect::back()->with('success', 'Default address updated.');
    }

    protected function markAsDefault(User $user, Address $address): void
    {
        $user->addresses()->whereKeyNot($address->id)->update(['is_default' => false]);

        if (!$address->is_default) {
            $address->is_default = true;
            $address->save();
        }
    }
}


