import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// Rutas relativas para que el mismo build sirva como PWA y dentro de Capacitor.
export default defineConfig({
  base: './',
  plugins: [svelte()],
  worker: { format: 'es' },
  build: { target: 'es2022' },
});
