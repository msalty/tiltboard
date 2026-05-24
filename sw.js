const CACHE = 'tiltboard-v7';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'data/exercises.json',
  'data/routines.json',
  'data/programs.json',
  'images/sliding-board/back-fly-with-leg-curl.webm',
  'images/sliding-board/back-fly.webm',
  'images/sliding-board/biceps-curl-with-crunching.webm',
  'images/sliding-board/biceps-curl-with-hyperextension.webm',
  'images/sliding-board/biceps-curl-with-leg-curl.webm',
  'images/sliding-board/biceps-curl.webm',
  'images/sliding-board/calf-raise.webm',
  'images/sliding-board/chest-fly.webm',
  'images/sliding-board/chest-press.webm',
  'images/sliding-board/chin-up.webm',
  'images/sliding-board/close-grip-chest-press.webm',
  'images/sliding-board/crossover-row.webm',
  'images/sliding-board/crunch-with-leg-curl.webm',
  'images/sliding-board/crunch.webm',
  'images/sliding-board/decline-chest-fly.webm',
  'images/sliding-board/front-deltoid-raise-with-leg-curl.webm',
  'images/sliding-board/front-deltoid-raise-with-supination-grip.webm',
  'images/sliding-board/front-deltoid-raise.webm',
  'images/sliding-board/front-lunge.webm',
  'images/sliding-board/high-leg-pull-in.webm',
  'images/sliding-board/hip-abduction.webm',
  'images/sliding-board/hip-adduction.webm',
  'images/sliding-board/hip-extension-with-knee-stabilized.webm',
  'images/sliding-board/hyperextension.webm',
  'images/sliding-board/incline-chest-fly.webm',
  'images/sliding-board/incline-push-up.webm',
  'images/sliding-board/inclined-crunch-with-feet-attached.webm',
  'images/sliding-board/jackknife-sit-up.webm',
  'images/sliding-board/jumping-and-twisting-squat.webm',
  'images/sliding-board/jumping-squat.webm',
  'images/sliding-board/kneeling-row.webm',
  'images/sliding-board/kneeling-triceps-extension.webm',
  'images/sliding-board/lateral-arm-pull.webm',
  'images/sliding-board/lateral-chest-fly.webm',
  'images/sliding-board/lateral-deltoid-raise.webm',
  'images/sliding-board/lateral-pulldown-with-squat.webm',
  'images/sliding-board/lateral-pulldown.webm',
  'images/sliding-board/lateral-single-arm-biceps-curl.webm',
  'images/sliding-board/lateral-single-arm-triceps-extension.webm',
  'images/sliding-board/leg-curl.webm',
  'images/sliding-board/low-leg-pull-in.webm',
  'images/sliding-board/lying-biceps-curl.webm',
  'images/sliding-board/lying-front-deltoid-raise.webm',
  'images/sliding-board/prone-back-fly.webm',
  'images/sliding-board/prone-triceps-extension.webm',
  'images/sliding-board/pull-up.webm',
  'images/sliding-board/pulldown-with-elbows-flexed.webm',
  'images/sliding-board/pulldown-with-squat-with-elbows-flexed.webm',
  'images/sliding-board/pullover-with-crunch.webm',
  'images/sliding-board/pullover-with-squat.webm',
  'images/sliding-board/pullover-with-twisting-crunch.webm',
  'images/sliding-board/pullover.webm',
  'images/sliding-board/resisted-crunch.webm',
  'images/sliding-board/reverse-leg-curl.webm',
  'images/sliding-board/rotating-back-fly.webm',
  'images/sliding-board/row-with-hyperextension.webm',
  'images/sliding-board/row.webm',
  'images/sliding-board/shoulder-extension-with-hyperextension.webm',
  'images/sliding-board/shoulder-extension-with-leg-curl.webm',
  'images/sliding-board/shoulder-extension.webm',
  'images/sliding-board/shoulder-press.webm',
  'images/sliding-board/side-plank.webm',
  'images/sliding-board/single-leg-pullover-with-squat.webm',
  'images/sliding-board/single-leg-squat-kneeling.webm',
  'images/sliding-board/single-leg-squat-on-side.webm',
  'images/sliding-board/single-leg-squat.webm',
  'images/sliding-board/sit-up-with-cable.webm',
  'images/sliding-board/sit-up-with-feet-attached.webm',
  'images/sliding-board/squat.webm',
  'images/sliding-board/triceps-extension.webm',
  'images/sliding-board/trunk-rotation.webm',
  'images/sliding-board/twisting-squat.webm',
  'images/sliding-board/upright-row-with-hyperextension.webm',
  'images/sliding-board/upright-row-with-leg-curl.webm',
  'images/sliding-board/upright-row.webm',
  'images/sliding-board/wide-grip-chest-press.webm',
  'images/sliding-board/wide-grip-front-deltoid-raise.webm',
  'images/sliding-board/wide-squat.webm'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
    })
  );
});
