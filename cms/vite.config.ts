import { defineConfig, loadEnv } from 'vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return ({
    plugins: [
      nodePolyfills(),
    ],
    define: {
      'import.meta.env.SERVER': JSON.stringify(env.SERVER),
      'import.meta.env.BLOGS_FOLDER': JSON.stringify(env.BLOGS_FOLDER),
      'import.meta.env.RESSOURCES_FOLDER': JSON.stringify(env.RESSOURCES_FOLDER)
    }
  })
})