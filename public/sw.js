const CACHE_NAME = 'salati-v1';
const OFFLINE_URL = '/index.html';

// 1. التثبيت: تخزين الصفحة الرئيسية فوراً كاحتياط
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([OFFLINE_URL, '/manifest.json']);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 2. الاستجابة: جلب من الإنترنت، وإذا فشل، ابحث في الكاش، وإذا فشل، أظهر الصفحة الرئيسية
self.addEventListener('fetch', (event) => {
  // لا نريد تخزين روابط الـ API الخارجية إذا كانت تسبب مشاكل، فقط ملفات الموقع
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.status === 200) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((res) => {
          return res || caches.match(OFFLINE_URL); // هنا الحل: إذا لم يجد الملف، يعطي index.html
        });
      })
  );
});
