const CACHE_NAME = 'salati-vfinal';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // حذف أي كاش قديم فوراً
  event.waitUntil(
    caches.keys().then((names) => {
      for (let name of names) caches.delete(name);
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // إذا نجح الإنترنت، خزن النسخة الجديدة
        if (networkResponse && networkResponse.status === 200) {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cacheCopy));
        }
        return networkResponse;
      });
      // أرجع النسخة المخبأة فوراً (لسرعة الفتح) أو انتظر الإنترنت
      return cachedResponse || fetchPromise;
    }).catch(() => {
        // إذا فشل كل شيء (أوفلاين تماماً) أرجع الصفحة الرئيسية
        return caches.match('/');
    })
  );
});
