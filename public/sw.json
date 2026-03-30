const CACHE_NAME = 'salati-v1';

// التثبيت: اجعل الـ Service Worker يسيطر فوراً
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// التفعيل: تنظيف أي كاش قديم
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// الاستراتيجية: حاول جلب البيانات من الإنترنت، وإذا فشلت (Offline) خذها من الكاش
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // إذا نجح الاتصال، خذ نسخة من الملف وضعها في الكاش للمستقبل
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // إذا انقطع الإنترنت، ابحث عن الملف في الكاش
        return caches.match(event.request);
      })
  );
});
