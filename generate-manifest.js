const fs = require('fs');
const path = require('path');
require('dotenv').config();

// --- CONFIGURACIÓN DE RUTAS DINÁMICAS ---
// Si existe la carpeta 'build', estamos en post-construcción. Si no, usamos 'public'.
const IS_BUILD = fs.existsSync(path.join(__dirname, 'build'));
const TARGET_DIR = IS_BUILD ? path.join(__dirname, 'build') : path.join(__dirname, 'public');
const SW_PATH = path.join(TARGET_DIR, 'service-worker.js');
const MANIFEST_PATH = path.join(TARGET_DIR, 'manifest.json');

/**
 * Función auxiliar para listar archivos de forma recursiva
 */
const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      // No incluimos el propio SW, ni mapas de fuente, ni archivos ocultos
      if (file !== 'service-worker.js' && !file.endsWith('.map') && !file.startsWith('.')) {
        const fullPath = path.join(dirPath, file);
        const relativePath = fullPath.replace(TARGET_DIR, '').replace(/\\/g, '/');
        arrayOfFiles.push(relativePath);
      }
    }
  });

  return arrayOfFiles;
};

/**
 * 1. GENERADOR DE MANIFEST.JSON
 */
const generateManifest = () => {
  const manifest = {
    "short_name": process.env.REACT_APP_NAME || "App",
    "name": process.env.REACT_APP_NAME || "Mi Aplicación React",
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#000000",
    "background_color": "#ffffff",
    "icons": [
      {
        "src": "favicon.ico",
        "sizes": "64x64 32x32 24x24 16x16",
        "type": "image/x-icon"
      },
      {
        "src": "logo192.png",
        "type": "image/png",
        "sizes": "192x192"
      }
    ]
  };

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
  console.log(`[Manifest] Generado en: ${TARGET_DIR}`);
};

/**
 * 2. GENERADOR DE SERVICE WORKER
 */
const generateServiceWorker = () => {
  const files = getAllFiles(TARGET_DIR);
  
  // Aseguramos que la raíz esté incluida
  if (!files.includes('/')) files.push('/');

  const swTemplate = `
/**
 * AUTO-GENERATED SERVICE WORKER
 * Modo: ${IS_BUILD ? 'PRODUCCIÓN (build)' : 'DESARROLLO (public)'}
 * Generado el: ${new Date().toLocaleString()}
 */

const CACHE_NAME = 'app-cache-v-${Date.now()}';
const ASSETS_TO_CACHE = ${JSON.stringify(files, null, 2)};

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cacheando ${files.length} archivos');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === 'navigate') return caches.match('/');
        });
      })
  );
});
`;

  fs.writeFileSync(SW_PATH, swTemplate);
  console.log(`[SW] Generado en: ${TARGET_DIR} (${files.length} archivos listados)`);
};

generateManifest();
generateServiceWorker();