if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('sw.js')
        .then(response => {
            console.log(`[Service Worker]  registered: ${response}`);
        })
        .catch(_ => {
            console.log('[Service Worker] registration failed');
        })
}