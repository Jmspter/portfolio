const VERSION = 'v1'
const SHELL_CACHE = `jp-shell-${VERSION}`
const ASSET_CACHE = `jp-assets-${VERSION}`

const PRECACHE = [
  '/',
  '/about',
  '/projects',
  '/blog',
  '/contact',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys()
    await Promise.all(keys
      .filter((key) => key.startsWith('jp-') && key !== SHELL_CACHE && key !== ASSET_CACHE)
      .map((key) => caches.delete(key)))
    await self.clients.claim()
  })())
})

function isAsset(url) {
  const path = url.pathname
  return path.startsWith('/_nuxt/')
    || path.startsWith('/img/')
    || path.startsWith('/icons/')
    || path.startsWith('/flags/')
    || /\.(png|webp|avif|jpe?g|svg|woff2?|ico)$/i.test(path)
}

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request)
        if (response && response.ok) {
          const clone = response.clone()
          caches.open(SHELL_CACHE).then((cache) => cache.put(request, clone))
          return response
        }
        throw new Error('network-error')
      }
      catch {
        const cached = await caches.match(request, { cacheName: SHELL_CACHE })
        if (cached) return cached
        return caches.match('/', { cacheName: SHELL_CACHE }) || Response.error()
      }
    })())
    return
  }

  if (isAsset(url)) {
    event.respondWith((async () => {
      const cached = await caches.match(request, { cacheName: ASSET_CACHE })
      if (cached) return cached
      const response = await fetch(request)
      if (response && response.ok) {
        const clone = response.clone()
        caches.open(ASSET_CACHE).then((cache) => cache.put(request, clone))
      }
      return response
    })())
  }
})