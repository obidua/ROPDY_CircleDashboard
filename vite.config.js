import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [react()],
    server: {
        headers: {
            'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
        }
    },
    esbuild: {
        target: 'esnext'
    },
    optimizeDeps: {
        esbuildOptions: {
            target: 'esnext'
        }
    }
});