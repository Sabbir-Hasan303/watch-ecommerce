<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;
use App\Http\Controllers\Auth\Concerns\ThrottlesLogins;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    use ThrottlesLogins;

    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        if ($this->hasTooManyLoginAttempts($request)) {
            Log::warning('Multiple failed login attempts', [
                'ip' => $request->ip(),
                'email' => $request->input($this->username()),
            ]);

            $this->fireLockoutEvent($request);

            return $this->sendLockoutResponse($request);
        }

        if (! Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $this->incrementLoginAttempts($request);

            throw ValidationException::withMessages([
                $this->username() => trans('auth.failed'),
            ]);
        }

        $this->clearLoginAttempts($request);

        $request->session()->regenerate();

        $user = $request->user();

        $redirectRoute = match ($user?->role) {
            'admin' => 'dashboard',
            'customer' => 'customer.dashboard',
            default => 'dashboard',
        };

        return redirect()->intended(route($redirectRoute, absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    protected function username(): string
    {
        return 'email';
    }
}
