
export function register() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const swUrl = `${process.env.PUBLIC_URL || ''}/service-worker.js`;
  
        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            console.log('[SW] Registro exitoso. Scope:', registration.scope);
  
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker == null) return;
              
              installingWorker.onstatechange = () => {
                if (installingWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // Hay contenido nuevo, pero el viejo sigue activo.
                    console.log('[SW] Nuevo contenido disponible, por favor recarga.');
                  } else {
                    // El contenido se ha guardado para uso offline.
                    console.log('[SW] Contenido cacheado para uso offline.');
                  }
                }
              };
            };
          })
          .catch((error) => {
            console.error('[SW] Error durante el registro:', error);
          });
      });
    }
  }
  
  export function unregister() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready
        .then((registration) => {
          registration.unregister();
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  }