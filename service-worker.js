self.addEventListener('install', function(event) {
  console.log('Service Worker installed');
});

self.addEventListener('activate', function(event) {
  console.log('Service Worker activated');
});

self.addEventListener('push', function(event) {
  const title = 'Asthma Aware Alert';
  const options = {
    body: event.data.text(),
    icon: 'icon.png',
    vibrate: [200, 100, 200]
  };
  event.waitUntil(self.registration.showNotification(title, options));
});