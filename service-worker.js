// Changement de version pour forcer la mise à jour
const CACHE_NAME = 'dashboard-v60'; 

const urlsToCache = [
    '.',
    'index.html',
    'lecteur.html',  // J'ai ajouté le lecteur ici !
    'style.css',
    'script.js',
    'manifest.json',
    'https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js'
];

self.addEventListener('install', event => {
    self.skipWaiting(); // Force le nouveau service worker à s'installer immédiatement
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Mise en cache des fichiers v3');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName); // Supprime l'ancien cache
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});
