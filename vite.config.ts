import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import path from 'node:path'
import { agentStaticGuardPlugin } from './vite.agent-static-guard.ts'
import { iconAssetsPlugin } from './vite.icon-assets.ts'

const NOVA_UI = path.resolve(import.meta.dirname, 'vendor/nova-ui/src')

export default defineConfig({
  plugins: [
    iconAssetsPlugin(import.meta.dirname),
    agentStaticGuardPlugin(import.meta.dirname),
    vanillaExtractPlugin(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@nova/ui/styles.css': path.join(NOVA_UI, 'styles/styles.ts'),
      '@nova/ui': NOVA_UI,
    },
    dedupe: ['react', 'react-dom', '@vanilla-extract/css'],
  },
})
