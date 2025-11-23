// Changement de version pour forcer la mise à jour immédiate sur le téléphone
const CACHE_NAME = 'dashboard-v4'; 

const urlsToCache = [
    '.',
    'index.html',
    'lecteur.html',
    'qcm.html',      // Le nouveau fichier qu'on vient d'ajouter
    'style.css',
    'script.js',
    'manifest.json',
    'https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js'
];

// Installation : on met en cache immédiatement
self.addEventListener('install', event => {
    self.skipWaiting(); // Force le nouveau service worker à prendre le contrôle
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Mise en cache des fichiers v4');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activation : on nettoie les vieux caches (v1, v2, v3...)
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Suppression de l\'ancien cache :', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch : on sert le cache, sinon le réseau
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si c'est dans le cache, on le rend. Sinon on va sur internet.
                return response || fetch(event.request);
            })
    );
});
