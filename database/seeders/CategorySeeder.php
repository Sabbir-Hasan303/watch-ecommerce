<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Luxury Watches',
                'slug' => 'luxury-watches',
            ],
            [
                'name' => 'Sports Watches',
                'slug' => 'sports-watches',
            ],
            [
                'name' => 'Dress Watches',
                'slug' => 'dress-watches',
            ],
            [
                'name' => 'Smart Watches',
                'slug' => 'smart-watches',
            ],
            [
                'name' => 'Vintage Watches',
                'slug' => 'vintage-watches',
            ],
            [
                'name' => 'Diving Watches',
                'slug' => 'diving-watches',
            ],
            [
                'name' => 'Pilot Watches',
                'slug' => 'pilot-watches',
            ],
            [
                'name' => 'Chronograph Watches',
                'slug' => 'chronograph-watches',
            ],
            [
                'name' => 'Automatic Watches',
                'slug' => 'automatic-watches',
            ],
            [
                'name' => 'Quartz Watches',
                'slug' => 'quartz-watches',
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
