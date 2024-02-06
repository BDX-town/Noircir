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
      if (registration.installing) {
        console.log("Installation du service worker en cours");
      } else if (registration.waiting) {
        console.log("Service worker installé");
      } else if (registration.active) {
        console.log("Service worker actif");
      }
    } catch (error) {
      console.error(`L'enregistrement a échoué : ${error}`);
    }

    navigator.serviceWorker.ready.then((registration) => {
      console.log('ready');
      console.log(registration.active);
      registration.active?.postMessage({ type: 'webdav', value: import.meta.env.VITE_SERVER })
    })
  }
};

// …

registerServiceWorker();

