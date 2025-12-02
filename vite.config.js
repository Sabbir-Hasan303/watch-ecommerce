import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    build: {
        target: 'esnext',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    'mui': ['@mui/material', '@mui/icons-material'],
                    'vendor': ['@inertiajs/react', 'axios', 'react', 'react-dom'],
                    'radix': ['@radix-ui/react-dialog', '@radix-ui/react-progress', '@radix-ui/react-slot'],
                }
            }
        },
        chunkSizeWarningLimit: 1000,
        cssCodeSplit: true,
        sourcemap: false,
        reportCompressedSize: false,
    },
});
