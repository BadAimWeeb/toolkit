import { precacheAndRoute, addPlugins } from 'workbox-precaching';
import type { HandlerDidCompleteCallbackParam } from "workbox-core/types";

declare let self: ServiceWorkerGlobalScope;

async function sendToClients(message: any) {
    const clients = await self.clients.matchAll();
    for (const client of clients) {
        client.postMessage(message);
    }
}

const manifestSize = self.__WB_MANIFEST.length;
let precacheCount = 0;
const handlerDidComplete = async ({ error, event }: HandlerDidCompleteCallbackParam) => {
    if (event.type === 'install') {
        if (error) {
            sendToClients({
                type: 'ERROR',
                e: error.message
            });
        } else {
            precacheCount++;
            if (precacheCount >= manifestSize) {
                sendToClients({
                    type: 'OFFLINE_READY_STATUS',
                    offlineReady: true
                });
            }
        }
    }
};

addPlugins([{ handlerDidComplete }]);

// Precache all assets
precacheAndRoute(self.__WB_MANIFEST);

// Making sure reload button works
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING')
        event.waitUntil(self.skipWaiting());

    if (event.data && event.data.type === 'ASK_OFFLINE_READY_STATUS') {
        event.waitUntil(sendToClients({
            type: 'OFFLINE_READY_STATUS',
            offlineReady: precacheCount >= manifestSize
        }));
    }
});
