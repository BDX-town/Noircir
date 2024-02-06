import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './main.css'
import "@bdxtown/canaille";

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
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      if (registration.installing || registration.waiting) {
        console.log("ServiceWorker installed, reloading to activate");
        await navigator.serviceWorker.ready;
        window.location.reload();
      } else if (registration.active) {
        console.log("ServiceWorker active");
        await navigator.serviceWorker.ready;
        registration.active.postMessage({ type: 'webdav', value: import.meta.env.VITE_SERVER })
      }
    } catch (error) {
      console.error(error);
    }
  }
};

registerServiceWorker();

