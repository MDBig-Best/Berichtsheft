// Berichtsheft – Offline-Speicher der App-Dateien
const CACHE='berichtsheft-v6';
const DATEIEN=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(DATEIEN)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
// Erst Netz (damit Updates ankommen), ohne Netz aus dem Speicher
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(CACHE).then(c=>c.put(e.request,k));return r})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
