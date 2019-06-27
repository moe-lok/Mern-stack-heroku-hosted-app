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