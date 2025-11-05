const CACHE_NAME = 'raindrop-v1'
const STATIC_CACHE_NAME = 'raindrop-static-v1'
const DYNAMIC_CACHE_NAME = 'raindrop-dynamic-v1'

// URLs to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets')
        // Cache assets individually to avoid failing on missing files
        return Promise.allSettled(
          STATIC_ASSETS.map(url => 
            cache.add(url).catch(err => console.warn('Failed to cache:', url, err))
          )
        )
      })
      .then(() => {
        console.log('Service Worker: Static assets cached')
        return self.skipWaiting()
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('Service Worker: Deleting old cache', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event
  
  // Skip non-GET requests and API calls
  if (request.method !== 'GET' || 
      request.url.includes('/api/') || 
      request.url.includes('clerk')) {
    return
  }

  // Skip external resources
  if (!request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          // For HTML pages, try to update in background
          if (request.headers.get('accept')?.includes('text/html')) {
            fetchAndUpdateCache(request)
          }
          return cachedResponse
        }

        // Otherwise fetch from network
        return fetch(request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone response for caching
            const responseToCache = response.clone()

            // Cache dynamic content
            if (request.headers.get('accept')?.includes('text/html') ||
                request.url.includes('/images/') ||
                request.url.match(/\.(css|js|png|jpg|jpeg|gif|webp|svg|woff2)$/)) {
              caches.open(DYNAMIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache)
                })
            }

            return response
          })
          .catch(() => {
            // Offline fallback for HTML pages
            if (request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/offline')
            }
            
            // Return a generic offline response for images
            if (request.url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) {
              return new Response(
                '<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#333"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999">Offline</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              )
            }
          })
      })
  )
})

// Helper function to fetch and update cache in background
function fetchAndUpdateCache(request) {
  return fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        const responseToCache = response.clone()
        caches.open(DYNAMIC_CACHE_NAME)
          .then((cache) => {
            cache.put(request, responseToCache)
          })
      }
    })
    .catch(() => {
      // Ignore network errors for background updates
    })
}

// Handle background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New notification from Raindrop',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  }

  event.waitUntil(
    self.registration.showNotification('Raindrop', options)
  )
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/explore')
    )
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.matchAll().then((clientList) => {
        for (const client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/')
        }
      })
    )
  }
})

async function doBackgroundSync() {
  // Implement background sync logic here
  // e.g., sync offline drafts, likes, comments
  console.log('Background sync triggered')
}