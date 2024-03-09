import { SW_MESSAGES } from './messages';

export async function registerServiceWorker() {
    if(!("serviceWorker" in navigator)) return;
    try {
        await navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });
    } catch (error) {
        console.error(error);
    }
  
    let sw: ServiceWorker | null;
  
    navigator.serviceWorker.ready.then((registration) => {
      sw = registration.active;
    })
    
    window.addEventListener('online', () => {
      if(!sw) return;
      sw.postMessage({ type: SW_MESSAGES.ONLINE });
    });
}

  
  