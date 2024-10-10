let resolvePromiseSW: (value: ServiceWorkerRegistration) => void = () => { },
    rejectPromiseSW: (reason?: any) => void = () => { },
    promiseSW = new Promise<ServiceWorkerRegistration>((resolve, reject) => {
        resolvePromiseSW = resolve;
        rejectPromiseSW = reject;
    });

let resolvePromiseSWC: (value: ServiceWorkerContainer) => void = () => { },
    rejectPromiseSWC: (reason?: any) => void = () => { },
    promiseSWC = new Promise<ServiceWorkerContainer>((resolve, reject) => {
        resolvePromiseSWC = resolve;
        rejectPromiseSWC = reject;
    });

export const ServiceWorkerRef: {
    sw?: ServiceWorkerRegistration,
    promise: Promise<ServiceWorkerRegistration>,
    swc?: ServiceWorkerContainer,
    promiseSWC: Promise<ServiceWorkerContainer>
} = {
    promise: promiseSW,
    promiseSWC: promiseSWC
};

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
            ServiceWorkerRef.sw = registration;
            resolvePromiseSW(registration);
            ServiceWorkerRef.swc = navigator.serviceWorker;
            resolvePromiseSWC(navigator.serviceWorker);
            console.log('ServiceWorker registered');
        })
        .catch((error) => {
            rejectPromiseSW(error);
            rejectPromiseSWC(error);
            console.error('ServiceWorker registration failed:', error);
        });
} else {
    rejectPromiseSW('ServiceWorker not supported');
}
