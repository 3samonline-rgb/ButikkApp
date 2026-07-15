const CACHE='butikkpro-v1';
const FILES=['./', './index.html'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES);}));
  self.skipWaiting();
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch',function(e){
  e.respondWith(caches.match(e.request).then(function(cached){
    if(e.request.destination==='document'){
      return fetch(e.request).then(function(r){
        var cl=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,cl);});return r;
      }).catch(function(){return cached;});
    }
    if(cached)return cached;
    return fetch(e.request).catch(function(){return caches.match('./index.html');});
  }));
});
