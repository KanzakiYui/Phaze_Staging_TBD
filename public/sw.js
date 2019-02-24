self.addEventListener('install', function() {
    console.log('Service Worker is Installed')
})

self.addEventListener('fetch', function() {
    //console.log('Service Worker Fetched')
})

self.addEventListener('activate', function() {
    console.log('Service Worker is Activated')
})

