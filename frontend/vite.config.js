import { defineConfig } from 'vite';
import { resolve } from 'path';

const root = resolve(__dirname);

export default defineConfig({
    root,

    // ── Dev Server ────────────────────────────────────────────────────────────
    server: {
        port: 5173,
        open: '/index.html',
        // Proxy all /api/* requests to the Express backend in development
        // This eliminates CORS issues entirely — no need to set BASE_URL in .env
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
            },
        },
    },

    // ── Multi-Page App Entry Points ───────────────────────────────────────────
    build: {
        outDir: resolve(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                // Root pages
                index:    resolve(root, 'index.html'),
                about:    resolve(root, 'about.html'),
                contact:  resolve(root, 'contact.html'),
                courses:  resolve(root, 'courses.html'),
                gallery:  resolve(root, 'gallery.html'),
                login:    resolve(root, 'login.html'),
                news:     resolve(root, 'news.html'),
                register: resolve(root, 'register.html'),
                services: resolve(root, 'services.html'),
                // Admin pages
                adminDashboard: resolve(root, 'admin/index.html'),
                adminLogin:     resolve(root, 'admin/login.html'),
            },
        },
    },
});
