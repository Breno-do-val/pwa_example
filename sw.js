const CACHE_NAME = 'app-shell-v2';

const URL_API = 'https://swapi.dev/api/people/?search=r2-d2';

/*
    Executing fetch() starts a request and returns a promise. When the request completes, 
    the promise is resolved with the Response. If the request fails due to some network problems, 
    the promise is rejected. 
 */
async function cacheData() {
    try {   
        const cache = await caches.open(CACHE_NAME);
        fetch(URL_API)
            .then(response => {
                if (!response) {
                    throw Error('Could not retrieve data...');
                }
                return cache.put(URL_API, response);
            })
    } catch (error) {
        console.log('Failed to install cache', error);
    }
}

self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker...');
    event.waitUntil(cacheData());
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        setInterval(() => {
            caches.keys().then(cache => {
                caches.delete(cache);
            })
            .catch(_ => 'Could not find any cache...')
        }, 2000)
    );
})

async function networkFirst(request) {
    try {
        return await fetch(request)
    } catch (_) {
        const cache = await caches.open(CACHE_NAME);
        return cache.match(request);
    }
}

self.addEventListener('fetch', event => {
    // console.log('[Service Worker] fetch event...', event);
    event.respondWith(networkFirst(event.request));
});