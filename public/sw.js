// Service Worker for Document Caching
// Optimizes loading performance for legal documents and PDFs

const CACHE_NAME = 'legal-docs-v1';
const DOCUMENT_CACHE_NAME = 'legal-documents-v1';

// Static assets to precache
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  // Add critical CSS and JS files here if needed
];

// Document patterns to cache
const DOCUMENT_PATTERNS = [
  /\/forms\/.*\.pdf$/,
  /\/docs\/.*$/,
  /\/api\/documents\/.*$/,
  /\/configs\/.*\.json$/
];

// Install event - precache critical assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Service worker installed successfully');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== DOCUMENT_CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, method } = request;

  // Only handle GET requests
  if (method !== 'GET') {
    return;
  }

  // Skip chrome-extension requests
  if (url.startsWith('chrome-extension://')) {
    return;
  }

  // Document caching strategy
  if (isDocumentRequest(url)) {
    event.respondWith(handleDocumentRequest(request));
    return;
  }

  // Static assets caching strategy
  if (isStaticAsset(url)) {
    event.respondWith(handleStaticRequest(request));
    return;
  }

  // API requests - network first with fallback
  if (url.includes('/api/')) {
    event.respondWith(handleAPIRequest(request));
    return;
  }
});

// Check if request is for a document
function isDocumentRequest(url) {
  return DOCUMENT_PATTERNS.some(pattern => pattern.test(url));
}

// Check if request is for a static asset
function isStaticAsset(url) {
  return url.includes('/static/') ||
         url.endsWith('.css') ||
         url.endsWith('.js') ||
         url.endsWith('.woff2') ||
         url.endsWith('.woff') ||
         url.includes('/_next/static/');
}

// Handle document requests - Cache first with network fallback
async function handleDocumentRequest(request) {
  const cache = await caches.open(DOCUMENT_CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    console.log('[SW] Serving document from cache:', request.url);
    // Serve from cache immediately
    fetchAndCache(request, cache); // Update cache in background
    return cached;
  }

  try {
    console.log('[SW] Fetching document from network:', request.url);
    const response = await fetch(request);

    if (response.ok) {
      // Clone response for caching
      const responseClone = response.clone();
      cache.put(request, responseClone);
      console.log('[SW] Cached document:', request.url);
    }

    return response;
  } catch (error) {
    console.error('[SW] Failed to fetch document:', request.url, error);
    // Return a fallback response or let it fail
    throw error;
  }
}

// Handle static asset requests - Cache first
async function handleStaticRequest(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Failed to fetch static asset:', request.url, error);
    throw error;
  }
}

// Handle API requests - Network first with cache fallback
async function handleAPIRequest(request) {
  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      const cache = await caches.open(DOCUMENT_CACHE_NAME);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.warn('[SW] Network failed for API request, trying cache:', request.url);

    const cache = await caches.open(DOCUMENT_CACHE_NAME);
    const cached = await cache.match(request);

    if (cached) {
      console.log('[SW] Serving API response from cache:', request.url);
      return cached;
    }

    throw error;
  }
}

// Background fetch and cache update
async function fetchAndCache(request, cache) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
      console.log('[SW] Updated cache in background:', request.url);
    }
  } catch (error) {
    console.warn('[SW] Background cache update failed:', request.url, error);
  }
}

// Message handling for cache management
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'CLEAR_CACHE':
      clearCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;

    case 'CACHE_DOCUMENT':
      if (payload && payload.url) {
        cacheDocument(payload.url).then(() => {
          event.ports[0].postMessage({ success: true });
        });
      }
      break;

    default:
      console.log('[SW] Unknown message type:', type);
  }
});

// Clear all caches
async function clearCaches() {
  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map(name => caches.delete(name)));
  console.log('[SW] All caches cleared');
}

// Manually cache a document
async function cacheDocument(url) {
  const cache = await caches.open(DOCUMENT_CACHE_NAME);
  try {
    await cache.add(url);
    console.log('[SW] Document cached manually:', url);
  } catch (error) {
    console.error('[SW] Failed to cache document:', url, error);
  }
}