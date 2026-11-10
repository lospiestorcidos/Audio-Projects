import { createHash } from 'node:crypto';
import { readdirSync } from 'node:fs';
import { defineConfig, type Plugin } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

/**
 * Genera sw.js al compilar: un service worker que guarda en caché todos los archivos del build
 * para que la app funcione sin conexión. El nombre de la caché cambia con cada build.
 */
function serviceWorker(): Plugin {
  return {
    name: 'tablas-sw',
    apply: 'build',
    generateBundle(_opts, bundle) {
      const files = ['./', ...Object.keys(bundle), ...readdirSync('public')].filter((f) => f !== 'sw.js');
      const version = createHash('sha1').update(files.join('|')).digest('hex').slice(0, 10);
      const source = `// Generado por vite.config.ts. No editar.
const CACHE = 'tablas-${version}';
const FILES = ${JSON.stringify(files)};
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k.startsWith('tablas-')).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  // Primero la caché (offline); si no está, la red; una navegación sin red cae en la página principal.
  e.respondWith(
    caches.match(req, { ignoreSearch: true, ignoreVary: true }).then((hit) => hit || fetch(req).catch(() => {
      if (req.mode === 'navigate') return caches.match('./');
      return Response.error();
    })),
  );
});
`;
      this.emitFile({ type: 'asset', fileName: 'sw.js', source });
    },
  };
}

// Rutas relativas para que el mismo build sirva como PWA y dentro de Capacitor.
export default defineConfig({
  base: './',
  plugins: [svelte(), serviceWorker()],
  worker: { format: 'es' },
  build: { target: 'es2022' },
});
