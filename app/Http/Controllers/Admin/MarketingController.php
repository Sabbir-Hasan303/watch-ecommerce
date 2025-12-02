<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateMarketingRequest;
use App\Models\Option;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MarketingController extends Controller
{
    /**
     * Display the marketing integrations page.
     */
    public function indexMeta(): Response
    {
        $metaSettings = Option::getValue('marketing_meta_settings', [
            'dataset_id' => '',
            'pixel_id' => '',
            'access_token' => '',
            'catalog' => '',
            'test_event_code' => '',
            'browser_tracking_enabled' => true,
            'server_tracking_enabled' => true,
        ]);

        return Inertia::render('Admin/Marketing/Meta', [
            'metaSettings' => $metaSettings,
        ]);
    }

    public function indexGoogle(): Response
    {
        $googleSettings = Option::getValue('marketing_google_settings', [
            'analytics_script' => '',
            'tag_manager_head_script' => '',
            'tag_manager_body_script' => '',
        ]);

        return Inertia::render('Admin/Marketing/Google', [
            'googleSettings' => $googleSettings,
        ]);
    }

    public function indexTiktok(): Response
    {
        $tiktokSettings = Option::getValue('marketing_tiktok_settings', [
            'pixel_script' => '',
        ]);

        return Inertia::render('Admin/Marketing/Tiktok', [
            'tiktokSettings' => $tiktokSettings,
        ]);
    }

    /**
     * Update Meta / Facebook Conversion API settings.
     */
    public function updateMeta(UpdateMarketingRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $meta = [
            'dataset_id' => $validated['dataset_id'] ?? '',
            'pixel_id' => $validated['pixel_id'] ?? '',
            'access_token' => $validated['access_token'] ?? '',
            'catalog' => $validated['catalog'] ?? '',
            'test_event_code' => $validated['test_event_code'] ?? '',
            'browser_tracking_enabled' => (bool) ($validated['browser_tracking_enabled'] ?? false),
            'server_tracking_enabled' => (bool) ($validated['server_tracking_enabled'] ?? false),
        ];

        Option::setValue('marketing_meta_settings', $meta);

        return redirect()
            ->route('admin.marketing.index')
            ->with('success', 'Meta settings updated successfully.');
    }

    /**
     * Update Google Analytics and Google Tag Manager settings.
     */
    public function updateGoogle(UpdateMarketingRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $google = [
            'analytics_script' => $validated['analytics_script'] ?? '',
            'tag_manager_head_script' => $validated['tag_manager_head_script'] ?? '',
            'tag_manager_body_script' => $validated['tag_manager_body_script'] ?? '',
        ];

        Option::setValue('marketing_google_settings', $google);

        return redirect()
            ->route('admin.marketing.index')
            ->with('success', 'Google settings updated successfully.');
    }

    /**
     * Update TikTok pixel script settings.
     */
    public function updateTiktok(UpdateMarketingRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $tiktok = [
            'pixel_script' => $validated['pixel_script'] ?? '',
        ];

        Option::setValue('marketing_tiktok_settings', $tiktok);

        return redirect()
            ->route('admin.marketing.index')
            ->with('success', 'TikTok settings updated successfully.');
    }
}


