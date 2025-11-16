<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();
        $verifiedParam = '?verified=1';

        if ($user->hasVerifiedEmail()) {
            // Redirect based on user role, same as login system
            if ($user->role === 'admin') {
                return redirect()->intended(route('admin.dashboard', absolute: false).$verifiedParam);
            }

            if ($user->role === 'customer') {
                return redirect()->intended(route('customer.dashboard', absolute: false).$verifiedParam);
            }

            return redirect()->intended(route('customer.dashboard', absolute: false).$verifiedParam);
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // Redirect based on user role, same as login system
        if ($user->role === 'admin') {
            return redirect()->intended(route('admin.dashboard', absolute: false).$verifiedParam);
        }

        if ($user->role === 'customer') {
            return redirect()->intended(route('customer.dashboard', absolute: false).$verifiedParam);
        }

        return redirect()->intended(route('customer.dashboard', absolute: false).$verifiedParam);
    }
}
