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

    <!-- Prevent flash of light mode by applying dark mode immediately -->
    <script>
        (function() {
            // Check localStorage first, then default to dark
            const savedMode = localStorage.getItem('themeMode');
            if (savedMode === 'light' || savedMode === 'dark') {
                document.documentElement.classList.toggle('dark', savedMode === 'dark');
            } else {
                // Default to dark mode and save it
                localStorage.setItem('themeMode', 'dark');
                document.documentElement.classList.add('dark');
            }
        })();
    </script>
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>
