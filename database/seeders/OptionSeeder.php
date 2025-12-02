<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Option;

class OptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $options = [
            // JSON values for shipping settings
            [
                'key' => 'shipping_settings',
                'value' => json_encode([
                    'inside_dhaka' => [
                        'standard' => 10.00,
                    ],
                    'outside_dhaka' => [
                        'standard' => 25.00,
                    ],
                    // 'free_shipping_threshold' => 500.00,
                    // 'free_shipping_enabled' => true
                ])
            ],

            // JSON values for tax settings
            [
                'key' => 'tax_settings',
                'value' => json_encode([
                    'rate' => 8.00,
                    'enabled' => false,
                ])
            ],
        ];

        foreach ($options as $optionData) {
            Option::updateOrCreate(
                ['key' => $optionData['key']],
                $optionData
            );
        }
    }
}
