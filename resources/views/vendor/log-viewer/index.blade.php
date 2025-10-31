<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full" id="log-viewer-html">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="shortcut icon" href="{{ asset(mix('img/log-viewer-32.png', config('log-viewer.assets_path'))) }}">

    <title>Log Viewer{{ config('app.name') ? ' - ' . config('app.name') : '' }}</title>

    <!-- Style sheets-->
    <link href="{{ asset(mix('app.css', config('log-viewer.assets_path'))) }}" rel="stylesheet" onerror="alert('app.css failed to load. Please refresh the page, re-publish Log Viewer assets, or fix routing for vendor assets.')">

    <script>
        // Sync theme from dashboard localStorage
        (function() {
            const themeMode = localStorage.getItem('themeMode') || 'dark';
            const htmlElement = document.documentElement;
            if (themeMode === 'dark') {
                htmlElement.classList.add('dark');
            } else {
                htmlElement.classList.remove('dark');
            }

            // Listen for theme changes from dashboard
            window.addEventListener('storage', function(e) {
                if (e.key === 'themeMode') {
                    const newTheme = e.newValue || 'dark';
                    if (newTheme === 'dark') {
                        htmlElement.classList.add('dark');
                    } else {
                        htmlElement.classList.remove('dark');
                    }
                }
            });

            // Also listen for custom event (in case of same-window theme changes)
            window.addEventListener('theme-changed', function(e) {
                const theme = e.detail?.theme || localStorage.getItem('themeMode') || 'dark';
                if (theme === 'dark') {
                    htmlElement.classList.add('dark');
                } else {
                    htmlElement.classList.remove('dark');
                }
            });
        })();
    </script>
</head>

<body class="h-full px-3 lg:px-5 bg-gray-100 dark:bg-gray-900">
<div id="log-viewer" class="flex h-full max-h-screen max-w-full">
    <router-view></router-view>
</div>

<!-- Global LogViewer Object -->
<script>
    window.LogViewer = @json($logViewerScriptVariables);

    // Add additional headers for LogViewer requests like so:
    // window.LogViewer.headers['Authorization'] = 'Bearer xxxxxxx';
</script>
<script src="{{ asset(mix('app.js', config('log-viewer.assets_path'))) }}" onerror="alert('app.js failed to load. Please refresh the page, re-publish Log Viewer assets, or fix routing for vendor assets.')"></script>
</body>
</html>
