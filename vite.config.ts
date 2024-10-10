import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import ViteFeVersionGenerator from './vite-fe-version-generator';
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [ViteFeVersionGenerator(), preact(), VitePWA({
    registerType: 'prompt',
    manifest: false,
    workbox: {
      globPatterns: [
        "**/*.{js,css,html,svg,png,json,webp,ico,woff2,woff,ttf,eot,otf,mp3,wasm}"
      ]
    },
    srcDir: 'src/sw',
    filename: 'sw.ts',
    strategies: 'injectManifest',
    injectRegister: null
  })],
})
