import { SW_MESSAGES } from './messages';

const subscribers: (({ type, data }: { type: SW_MESSAGES, data: unknown}) => void) [] = [];

export function subscribe(callback: ({ type, data }: { type: SW_MESSAGES, data: unknown}) => void) {
  subscribers.push(callback);
}

export function unsubscribe(callback: ({ type, data }: { type: SW_MESSAGES, data: unknown}) => void) {
  const index = subscribers.indexOf(callback);
  if(index !== -1) subscribers.splice(index, 1);
}


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
    });

    navigator.serviceWorker.addEventListener("message", (event) => {
      subscribers.forEach((fn) => fn(event.data));
    });
    
    window.addEventListener('online', () => {
      if(!sw) return;
      sw.postMessage({ type: SW_MESSAGES.ONLINE });
    });
}

  
  