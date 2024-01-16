import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills  } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  define:{
    global:JSON.stringify({})
  },
  optimizeDeps: {
    include: ['@bdxtown/canaille'],
  },
  build: {
    commonjsOptions: {
      include: [/@bdxtown\/canaille/, /node_modules/],
    },
  },
  resolve: {
    alias: {"react":"react", "react-dom": "react-dom"}
  }
})
