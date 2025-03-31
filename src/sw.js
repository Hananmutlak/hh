const CACHE_NAME = 'v1';
const ASSETS = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/js/main.js',
    '/js/map.js',
    '/js/charts.js',

   
 
  
'/news.html',
    '/scss/news.scss',
    '/js/news.js',
    '/assets/images/hero-bg.jpg',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('newsapi.org')) {
        // لا تقم بتخزين طلبات الـ API
        event.respondWith(fetch(event.request));
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );
    }
});