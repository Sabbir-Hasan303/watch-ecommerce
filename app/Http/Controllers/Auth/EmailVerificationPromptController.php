<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
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

        return Inertia::render('Auth/VerifyEmail', ['status' => session('status')]);
    }
}
