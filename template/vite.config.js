const path = require('path')
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    lib: {
        entry: path.resolve(__dirname, 'src/index.ts'),
        name: "noircir_template",
        fileName: (format) => `index.${format}.js`
    }
  },
  resolve: {
    alias: {"react":"react", "react-dom": "react-dom"}
  }
})
