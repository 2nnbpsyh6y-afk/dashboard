const CACHE_NAME = 'dashboard-v2';
const urlsToCache = [
    '.',
    'index.html',
    'style.css',
    'script.js',
    'manifest.json'
    // Tu devras ajouter 'icon-192.png' et 'icon-512.png' ici
];

// Installation du Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache ouvert');
                return cache.addAll(urlsToCache);
            })
    );
});

// Stratégie "Cache first"
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Si la ressource est dans le cache, on la retourne
                if (response) {
                    return response;
                }
                // Sinon, on va la chercher sur le réseau
                return fetch(event.request);
            })
    );
});
