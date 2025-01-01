import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { createHtmlPlugin } from 'vite-plugin-html';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 8080,
  },
  plugins: [
    react(),
    createHtmlPlugin({
      entry: '../src/index.tsx',
      template: './public/index.html',
    }),
    VitePWA({
      registerType: 'autoUpdate',
      // devOptions: { enabled: true },
      manifest: false,
      manifestFilename: 'manifest.json',
      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'favicon-16x16.png',
        'favicon-32x32.png',
        'browserconfig.xml',
        'mstile-150x150.png',
        'safari-pinned-tab.svg',
      ],
      strategies: 'generateSW',
    }),
  ],
});
