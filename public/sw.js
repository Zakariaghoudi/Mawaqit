const CACHE_NAME = 'salati-v-ultimate';
// هذه الملفات هي التي تمنع الشاشة البيضاء
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png' // تأكد من وجود الأيقونة التي رفعناها سابقاً
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching essential assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // استراتيجية: ابحث في الكاش أولاً، إذا لم تجد اذهب للإنترنت
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      
      return fetch(event.request).then((networkResponse) => {
        // تخزين أي ملف جديد يتم تحميله (مثل ملفات الـ JS الخاصة بـ Vite)
        if (networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
        }
        return networkResponse;
      }).catch(() => {
        // إذا كنت أوفلاين تماماً والملف ليس في الكاش، ارجع للصفحة الرئيسية
        return caches.match('/');
      });
    })
  );
});
