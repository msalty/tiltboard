// ─── Install namespace ───────────────────────────────
// Nearly every storage API a service worker can reach — CacheStorage above
// all — is keyed by ORIGIN, not by scope. This app shares its origin with
// other PWAs in sibling directories, so anything global here stomps the
// neighbours. Derive the namespace at runtime from where this copy actually
// sits; never hardcode a path, so the app stays portable to any directory on
// any web server.
const CACHE_PREFIX = 'tiltboard';
const CACHE_SEP = '::';
const CACHE_VERSION = 'v10';

// self.location is the sw.js URL, so './' is this copy's install directory:
// https://host/tiltboard/ when deployed to a subdirectory, https://host/ at a
// domain root. The page-side equivalent is new URL('./', document.baseURI).
const APP_SCOPE = new URL('./', self.location);
const APP_BASE = APP_SCOPE.pathname;

// The base path is delimited on BOTH sides, and isOwnCache() compares that
// middle segment for equality rather than prefix-matching the whole name.
// A root install's base ('/') is a string prefix of a subdirectory install's
// ('/tiltboard/'), so a startsWith() filter would let a root copy claim — and
// delete — a subdirectory copy's caches. Exact segment equality can't.
const CACHE = CACHE_PREFIX + CACHE_SEP + APP_BASE + CACHE_SEP + CACHE_VERSION;

function isOwnCache(name) {
  const parts = name.split(CACHE_SEP);
  return parts.length === 3 && parts[0] === CACHE_PREFIX && parts[1] === APP_BASE;
}

// Caches written by releases that predated this namespace ('tiltboard-v1' …
// 'tiltboard-v9'). They no longer match isOwnCache(), so sweep them by their
// own historical pattern or they leak on the origin forever.
const LEGACY_CACHE_RE = /^tiltboard-v\d+$/;

// A same-origin request outside this copy's directory belongs to a
// neighbouring app: never answer it, never take a copy of it. APP_BASE always
// ends in '/', so '/tiltboardx/foo' can't pass for '/tiltboard/'.
function inScope(url) {
  return url.origin === APP_SCOPE.origin && url.pathname.startsWith(APP_BASE);
}

const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'favicon.svg',
  'favicon.ico',
  'favicon-96x96.png',
  'apple-touch-icon.png',
  'icons/web-app-manifest-192x192.png',
  'icons/web-app-manifest-512x512.png',
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
    // caches.keys() lists every cache on the ORIGIN, including neighbouring
    // apps'. Only ever delete our own — this copy's namespace, plus the
    // legacy un-namespaced names this app itself used to write.
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE && (isOwnCache(k) || LEGACY_CACHE_RE.test(k)))
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  // Anything outside this copy's directory (a neighbouring app on the shared
  // origin, or a cross-origin asset) is none of our business. Declining to
  // call respondWith() lets the browser handle it normally.
  const url = new URL(e.request.url);
  if (!inScope(url)) return;

  // Every lookup below goes through caches.open(CACHE) rather than the global
  // caches.match(), which answers from the FIRST cache on the origin holding
  // the URL — potentially a neighbour's copy of a same-named file.

  // Network-first for the app shell so a UI change can't get stuck behind a
  // stale cache entry. Falls back to cache when offline.
  const isShell = e.request.mode === 'navigate' || url.pathname.endsWith('/index.html');
  if (isShell) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.open(CACHE).then(c =>
        c.match(e.request).then(hit => hit || c.match(new URL('index.html', self.location).href))
      ))
    );
    return;
  }

  e.respondWith(
    caches.open(CACHE).then(c => c.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok) c.put(e.request, res.clone());
        return res;
      }).catch(() => cached);
    }))
  );
});
