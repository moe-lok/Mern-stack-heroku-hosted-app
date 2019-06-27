if ('function' === typeof importScripts) {
  importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js'
  );
  /* global workbox */
  if (workbox) {
    console.log('Workbox is loaded');
 
    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([]);
 
/* custom cache rules*/
workbox.routing.registerNavigationRoute('/index.html', {
      blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/],
    });
 
workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg)$/,
      workbox.strategies.cacheFirst({
        cacheName: 'images',
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          }),
        ],
      })
    );
 
} else {
    console.log('Workbox could not be loaded. No Offline support');
  }
}

console.log('Service Worker Loaded...');

self.addEventListener('push', e =>{
    console.log(e);
    console.log(e.data);
    console.log(e.data.json().title);
    const data = e.data.json();
    console.log('Push Received...1');
    self.registration.showNotification(data.title, {
        body: 'Notified by Fortra',
        icon: 'https://muhd-lokman.weebly.com/uploads/1/2/7/7/12772082/editor/fortra-design-1.png?1509001589'
    });
});