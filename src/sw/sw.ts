import { precacheAndRoute } from 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

// Precache all assets
precacheAndRoute(self.__WB_MANIFEST);

// Making sure reload button works
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING')
        event.waitUntil(self.skipWaiting());
});
