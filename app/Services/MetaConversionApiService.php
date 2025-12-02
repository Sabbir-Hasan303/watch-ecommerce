<?php

namespace App\Services;

use App\Models\Option;
use FacebookAds\Api;
use FacebookAds\Object\ServerSide\Content;
use FacebookAds\Object\ServerSide\CustomData;
use FacebookAds\Object\ServerSide\Event;
use FacebookAds\Object\ServerSide\EventRequest;
use FacebookAds\Object\ServerSide\UserData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MetaConversionApiService
{
    public static function trackViewContent($product, Request $request): void
    {
        $settings = self::getSettings();
        if (!$settings['server_enabled']) {
            return;
        }

        $customData = (new CustomData())
            ->setContentIds([$product->id])
            ->setContentType('product')
            ->setContentName($product->name)
            ->setValue((float) ($product->min_price ?? $product->price ?? 0))
            ->setCurrency('BDT');

        $event = self::buildEvent('ViewContent', $customData, $request, uniqid('view_', true));

        self::sendEvent($event, $settings);
    }

    public static function trackAddToCart($product, int $quantity, Request $request): void
    {
        $settings = self::getSettings();
        if (!$settings['server_enabled']) {
            return;
        }

        $unitPrice = (float) ($product->min_price ?? $product->price ?? 0);

        $content = (new Content())
            ->setProductId((string) $product->id)
            ->setQuantity($quantity)
            ->setItemPrice($unitPrice);

        $customData = (new CustomData())
            ->setContentIds([(string) $product->id])
            ->setContents([$content])
            ->setContentType('product')
            ->setContentName($product->name)
            ->setValue($unitPrice * $quantity)
            ->setCurrency('BDT');

        $event = self::buildEvent('AddToCart', $customData, $request, uniqid('cart_', true));

        self::sendEvent($event, $settings);
    }

    public static function trackInitiateCheckout($cart, Request $request): void
    {
        $settings = self::getSettings();
        if (!$settings['server_enabled']) {
            return;
        }

        $contents = [];
        $contentIds = [];
        $total = 0.0;
        $itemCount = 0;

        foreach ($cart->items as $item) {
            $contentIds[] = (string) $item->product_id;
            $contents[] = (new Content())
                ->setProductId((string) $item->product_id)
                ->setQuantity((int) $item->quantity)
                ->setItemPrice((float) $item->unit_price);

            $total += (float) $item->unit_price * (int) $item->quantity;
            $itemCount += (int) $item->quantity;
        }

        $customData = (new CustomData())
            ->setContentIds($contentIds)
            ->setContents($contents)
            ->setContentType('product')
            ->setValue($total)
            ->setCurrency('BDT')
            ->setNumItems($itemCount);

        $event = self::buildEvent('InitiateCheckout', $customData, $request, uniqid('checkout_', true));

        self::sendEvent($event, $settings);
    }

    public static function trackPurchase($order, Request $request): void
    {
        $settings = self::getSettings();
        if (!$settings['server_enabled']) {
            return;
        }

        $order->loadMissing('items');

        $contents = [];
        $contentIds = [];
        $itemCount = 0;

        foreach ($order->items as $item) {
            $contentIds[] = (string) $item->product_id;
            $contents[] = (new Content())
                ->setProductId((string) $item->product_id)
                ->setQuantity((int) $item->quantity)
                ->setItemPrice((float) $item->unit_price);

            $itemCount += (int) $item->quantity;
        }

        $customData = (new CustomData())
            ->setContentIds($contentIds)
            ->setContents($contents)
            ->setContentType('product')
            ->setValue((float) $order->total)
            ->setCurrency('BDT')
            ->setNumItems($itemCount)
            ->setOrderId((string) $order->id);

        $eventId = 'order_' . $order->id;

        $event = self::buildEvent('Purchase', $customData, $request, $eventId);

        self::sendEvent($event, $settings);
    }

    private static function getSettings(): array
    {
        $settings = Option::getValue('marketing_meta_settings', []);

        return [
            'pixel_id' => $settings['dataset_id'] ?? null,
            'access_token' => $settings['access_token'] ?? null,
            'test_event_code' => $settings['test_event_code'] ?? null,
            'server_enabled' => (bool) ($settings['server_tracking_enabled'] ?? false),
        ];
    }

    private static function buildEvent(string $name, CustomData $customData, Request $request, string $eventId): Event
    {
        $userData = (new UserData())
            ->setClientIpAddress($request->ip())
            ->setClientUserAgent($request->userAgent())
            ->setFbp($request->cookie('_fbp'))
            ->setFbc($request->cookie('_fbc'));

        return (new Event())
            ->setEventName($name)
            ->setEventTime(time())
            ->setEventSourceUrl($request->fullUrl())
            ->setActionSource('website')
            ->setUserData($userData)
            ->setCustomData($customData)
            ->setEventId($eventId);
    }

    private static function sendEvent(Event $event, array $settings): void
    {
        if (empty($settings['pixel_id']) || empty($settings['access_token'])) {
            return;
        }

        try {
            Api::init(null, null, $settings['access_token']);

            $request = (new EventRequest($settings['pixel_id']))
                ->setEvents([$event]);

            if (!app()->environment('production') && !empty($settings['test_event_code'])) {
                $request->setTestEventCode($settings['test_event_code']);
            }

            $response = $request->execute();

            Log::info('Meta Conversion API event sent', [
                'event' => $event->getEventName(),
                'event_id' => $event->getEventId(),
                'response' => $response->getContent(),
            ]);
        } catch (\Throwable $throwable) {
            Log::error('Meta Conversion API event failed', [
                'event' => $event->getEventName(),
                'event_id' => $event->getEventId(),
                'error' => $throwable->getMessage(),
            ]);
        }
    }
}


