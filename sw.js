const C='bhagat-v1',F=['./','index.html','style.css','data.js','app.js','photo1.jpg','photo2.jpg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
