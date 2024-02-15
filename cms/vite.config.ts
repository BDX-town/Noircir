import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills  } from 'vite-plugin-node-polyfills';
import analyze from "rollup-plugin-analyzer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills(), analyze()],
  define:{
    global:JSON.stringify({})
  },
  optimizeDeps: {
    include: ['@bdxtown/canaille', '**/node_modules/**'],
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
