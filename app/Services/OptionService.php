<?php

namespace App\Services;

use App\Models\Option;

class OptionService
{
    /**
     * Get tax rate
     */
    public static function getTaxRate()
    {
        $taxSettings = Option::getValue('tax_settings', []);
        return $taxSettings['rate'] ?? 0;
    }

    /**
     * Check if tax is enabled
     */
    public static function isTaxEnabled()
    {
        $taxSettings = Option::getValue('tax_settings', []);
        return $taxSettings['enabled'] ?? false;
    }

    /**
     * Get shipping settings
     */
    public static function getShippingSettings()
    {
        return Option::getValue('shipping_settings', []);
    }

    /**
     * Get free shipping threshold
     */
    // public static function getFreeShippingThreshold()
    // {
    //     $shippingSettings = Option::getValue('shipping_settings', []);
    //     return $shippingSettings['free_shipping_threshold'] ?? 0;
    // }

    /**
     * Check if free shipping is enabled
     */
    public static function isFreeShippingEnabled()
    {
        $shippingSettings = Option::getValue('shipping_settings', []);
        return $shippingSettings['free_shipping_enabled'] ?? false;
    }

    /**
     * Calculate shipping cost with free shipping logic
     */
    // public static function calculateShippingCost($area, $method = 'standard', $subtotal = 0)
    // {
    //     // Check if free shipping applies
    //     if (self::isFreeShippingEnabled() && $subtotal >= self::getFreeShippingThreshold()) {
    //         return 0;
    //     }

    //     return self::getShippingCost($area, $method);
    // }

    /**
     * Calculate tax amount
     */
    public static function calculateTax($subtotal)
    {
        if (!self::isTaxEnabled()) {
            return 0;
        }

        return ($subtotal * self::getTaxRate()) / 100;
    }
}
