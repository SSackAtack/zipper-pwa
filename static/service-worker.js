// Ten plik jest na razie pusty, ale jest niezbędny dla PWA.
// W przyszłości będzie odpowiadał za działanie offline.
self.addEventListener('install', (event) => {
  console.log('Service Worker instalowany.');
});

self.addEventListener('fetch', (event) => {
  // Na razie nie robimy nic z zapytaniami, po prostu je przepuszczamy.
  event.respondWith(fetch(event.request));
});