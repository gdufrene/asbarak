// Nom du cache (change-le pour invalider)
const CACHE = 'nav-pwa-v1';

// Fichiers à mettre en cache à l'installation
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  // ajoute ici tes icônes :
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // Stratégie "Network falling back to Cache"
  e.respondWith(
    fetch(req).then(res => {
      const resClone = res.clone();
      caches.open(CACHE).then(c => c.put(req, resClone)).catch(()=>{});
      return res;
    }).catch(() => caches.match(req))
  );
});
