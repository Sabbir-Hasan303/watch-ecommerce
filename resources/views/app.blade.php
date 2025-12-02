<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead

    @php
        $metaSettings = \App\Models\Option::getValue('marketing_meta_settings', []);
        $googleSettings = \App\Models\Option::getValue('marketing_google_settings', []);
        $tiktokSettings = \App\Models\Option::getValue('marketing_tiktok_settings', []);

        $metaPixelId = $metaSettings['dataset_id'] ?? null;
        $metaBrowserEnabled = $metaSettings['browser_tracking_enabled'] ?? false;
    @endphp

    {{-- Google Analytics --}}
    @if (!empty($googleSettings['analytics_script']))
        {!! $googleSettings['analytics_script'] !!}
    @endif

    {{-- Google Tag Manager (Head) --}}
    @if (!empty($googleSettings['tag_manager_head_script']))
        {!! $googleSettings['tag_manager_head_script'] !!}
    @endif

    {{-- TikTok Pixel --}}
    @if (!empty($tiktokSettings['pixel_script']))
        {!! $tiktokSettings['pixel_script'] !!}
    @endif

    {{-- Meta Pixel (Browser Tracking) --}}
    @if ($metaBrowserEnabled && !empty($metaPixelId))
        <script>
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '{{ $metaPixelId }}');
            fbq('track', 'PageView');
        </script>
        <noscript>
            <img height="1" width="1" style="display:none"
                 src="https://www.facebook.com/tr?id={{ $metaPixelId }}&ev=PageView&noscript=1"/>
        </noscript>
    @endif
</head>

<body class="font-sans antialiased">
    {{-- Google Tag Manager (Body) --}}
    @if (!empty($googleSettings['tag_manager_body_script']))
        {!! $googleSettings['tag_manager_body_script'] !!}
    @endif
    @inertia
</body>

</html>
