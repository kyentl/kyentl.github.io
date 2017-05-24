
importScripts('sw-cache-addall.js');

// A list of paths to cache
var paths = [
    '/',
    '/css/main.css',
    '/css/materialize.css',
    '/js/main.js',
    '/js/materialize.js',
    '/Search.html'
];

// Open the cache (and name it)

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open('offline')
            .then(function(cache) {
                return cache.addAll(paths);
            })
    );
    event.waitUntil(self.skipWaiting());
});