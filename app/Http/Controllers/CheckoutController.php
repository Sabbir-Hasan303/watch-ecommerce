<?php

namespace App\Http\Controllers;

use App\Services\OptionService;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(): Response
    {
        $optionShippingSettings = OptionService::getShippingSettings();

        $shippingOptions = [
            'inside_dhaka' => [
                'standard' => 10.0,
                'free' => 0.0,
            ],
            'outside_dhaka' => [
                'standard' => 25.0,
                'free' => 0.0,
            ],
        ];

        foreach ($optionShippingSettings as $area => $config) {
            if (!\is_array($config)) {
                continue;
            }

            $shippingOptions[$area] = [
                'standard' => isset($config['standard']) ? (float) $config['standard'] : ($shippingOptions[$area]['standard'] ?? 0.0),
                'free' => isset($config['free']) ? (float) $config['free'] : ($shippingOptions[$area]['free'] ?? 0.0),
            ];
        }

        $taxSettings = [
            'enabled' => OptionService::isTaxEnabled(),
            'rate' => (float) OptionService::getTaxRate(),
        ];

        return Inertia::render('Web/Checkout', [
            'shippingOptions' => $shippingOptions,
            'taxSettings' => $taxSettings,
        ]);
    }
}


