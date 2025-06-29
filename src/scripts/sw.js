const CACHE_NAME = 'story-app-cache-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/app.bundle.js',
    '/app.css', // Jika kamu memisahkan CSS
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(URLS_TO_CACHE);
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response; // Ambil dari cache jika ada
                }
                return fetch(event.request); // Jika tidak, fetch dari network
            })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName); // Hapus cache lama
                    }
                })
            );
        })
    );
    self.addEventListener('push', (event) => {
        const notificationData = event.data.json(); // Ambil data dari push
        const { title, options } = notificationData;

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    });
});