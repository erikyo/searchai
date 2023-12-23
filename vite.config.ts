import {defineConfig} from 'vite'
import {VitePWA} from 'vite-plugin-pwa'

const basePath = "/searchai/";

export default defineConfig({
  base: basePath,
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'injectManifest',
      srcDir: 'src/sw',
      filename: 'worker.ts',
      devOptions: {
        enabled: true,
        type: 'module',
      },
      injectManifest: {
        globPatterns: ['**/*.{js,css,html}'],
      },
      includeAssets: ['index.html', 'favicon.ico', 'apple-touch-icon.png', 'pwa-maskable-192x192.png'],
      manifest: {
        name: 'My Awesome App',
        short_name: 'MyApp',
        display: "standalone",
        description: 'My Awesome App description',
        theme_color: '#ffffff',
        background_color: "#FFFFFF",
        icons: [
          {
            src: basePath + "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: basePath + "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          },
          {
            src: basePath + "pwa-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: basePath + "pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
      }
    })
  ],
})
