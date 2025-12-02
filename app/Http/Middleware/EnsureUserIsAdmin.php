<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        if ($user->role !== 'admin') {
            if ($request->expectsJson()) {
                abort(403);
            }

            return redirect()->route('customer.dashboard');
        }

        return $next($request);
    }
}

