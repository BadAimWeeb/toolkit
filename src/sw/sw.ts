import { precacheAndRoute, addPlugins } from 'workbox-precaching';
import { getOrCreatePrecacheController } from 'workbox-precaching/utils/getOrCreatePrecacheController';
import type { HandlerDidCompleteCallbackParam } from "workbox-core/types";

declare let self: ServiceWorkerGlobalScope;

const manifest = self.__WB_MANIFEST;

async function sendToClients(message: any) {
    const clients = await self.clients.matchAll();
    for (const client of clients) {
        client.postMessage(message);
    }
}

const manifestSize = manifest.length;
let precacheCount = 0;

const controller = getOrCreatePrecacheController();

const handlerDidComplete = async ({ error, event }: HandlerDidCompleteCallbackParam) => {
    if (event.type === 'install') {
        if (error) {
            await sendToClients({
                type: 'ERROR',
                e: error.message
            });
        } else {
            precacheCount++;
            if (precacheCount >= manifestSize) {
                await sendToClients({
                    type: 'OFFLINE_READY_STATUS',
                    offlineReady: true
                });
            }
        }
    }
};

addPlugins([{ handlerDidComplete }]);

// Precache all assets
precacheAndRoute(manifest);

// Making sure reload button works
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING')
        event.waitUntil(self.skipWaiting());

    if (event.data && event.data.type === 'ASK_OFFLINE_READY_STATUS') {
        event.waitUntil(sendToClients({
            type: 'OFFLINE_READY_STATUS',
            offlineReady: controller.getCachedURLs().length >= manifestSize
        }));
    }
});
