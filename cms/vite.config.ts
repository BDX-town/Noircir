import { defineConfig } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    nodePolyfills(),
  ],
  define: {
    'import.meta.env.SERVER': JSON.stringify(process.env.SERVER),
    'import.meta.env.BLOGS_FOLDER': JSON.stringify(process.env.BLOGS_FOLDER),
    'import.meta.env.RESSOURCES_FOLDER': JSON.stringify(process.env.RESSOURCES_FOLDER)
  }
})