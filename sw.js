const CACHE_NAME = 'app-shell-v1';

async function retrieveCharacter(name) {
    try {
        const response =  await fetch(`https://swapi.dev/api/people/?search=${name}`);
        const character = await response.json();
        return character.results;
    } catch (error) {
        console.log('Server error!', error);
    }
}

async function cacheData() {
    try {
        const result = await retrieveCharacter('r2-d2');
        console.log('[Cache Data]', result);
        const cache = await caches.open(CACHE_NAME);
        return await cache.add(result);
    } catch (error) {
        console.log('Failed to install cache', error);
    }
}

self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker...');
    event.waitUntil(cacheData());
    self.skipWaiting();
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