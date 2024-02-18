import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './main.css'
import "@bdxtown/canaille";

// @ts-expect-error we need that to reload in dev mode
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import SW from '../public/sw.js?url';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
    } catch (error) {
      console.error(error);
    }
  }
};

// registerServiceWorker();

