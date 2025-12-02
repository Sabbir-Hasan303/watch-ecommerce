import '../css/app.css';
import './bootstrap';

import { createInertiaApp, router } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { CssBaseline } from '@mui/material';
import { ThemeContextProvider } from '@/contexts/ThemeContext'

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${appName} - ${title}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        const isAuthenticatedPage = props.initialPage.url.startsWith('/admin')

        const content = isAuthenticatedPage ? (
            <ThemeContextProvider>
                <App {...props} />
            </ThemeContextProvider>
        ) : (
            <App {...props} />
        );
        root.render(content);
    },
    progress: {
        color: '#4B5563',
    },
});

// * Automatically scroll to top when navigating to a new page
router.on('navigate', () => {
    window.scrollTo(0, 0);
});
