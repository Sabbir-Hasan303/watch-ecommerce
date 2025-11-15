<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            // Redirect based on user role, same as login system
            if ($user->role === 'admin') {
                return redirect()->intended(route('admin.dashboard', absolute: false));
            }

            if ($user->role === 'customer') {
                return redirect()->intended(route('customer.dashboard', absolute: false));
            }

            return redirect()->intended(route('customer.dashboard', absolute: false));
        }

        $user->sendEmailVerificationNotification();

        return back()->with('status', 'verification-link-sent');
    }
}
