// Fires when the service worker is installed for the first time
self.addEventListener("install", (e) => {
    // Skip waiting forces this SW to become active immediately
    self.skipWaiting();
})

// Fires when the service worker is activated
self.addEventListener('activate', (e) => {
    e.waitUntil(clients.claim());
    console.log('Service worker activated');
})

// Fires when a push notification is received
self.addEventListener('push', async (e) => {
    // Notification will be display here
    if(!e.data) return;

    const data = e.data.json();

    e.waitUntil(
        // Show notification here
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: '/icons/pwa-192x192.png',
            data: { url: data.url }
        })
    )
})

// Fires when the user clicks on the notification
self.addEventListener("notificationclick", (e) => {
    // Close the notification banner
    e.notification.close();

    const url = e.notification.data?.url || '/'
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Check if app is already open in some tab
                for(const client of clientList){
                    if('focus' in client){
                        client.focus()
                        return client.navigate(url);
                    }
                }

                // App is not open - open a new tab
                return clients.openWindow(url)
            })
    )
})