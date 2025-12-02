<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Option;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $metaSettings = Option::getValue('marketing_meta_settings', []);
        $googleSettings = Option::getValue('marketing_google_settings', []);
        $tiktokSettings = Option::getValue('marketing_tiktok_settings', []);

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'marketing' => [
                'meta' => $metaSettings,
                'google' => $googleSettings,
                'tiktok' => $tiktokSettings,
            ],
        ];
    }
}
