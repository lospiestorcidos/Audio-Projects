import { mount } from 'svelte';
import './app.css';
import App from './ui/App.svelte';

// iPad: bloquea el zoom por pellizco y por doble toque.
for (const ev of ['gesturestart', 'gesturechange', 'gestureend']) {
  document.addEventListener(ev, (e) => e.preventDefault(), { passive: false });
}
document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });
document.addEventListener('contextmenu', (e) => e.preventDefault());

mount(App, { target: document.getElementById('app')! });

// PWA: el service worker deja la app disponible sin conexión. Dentro de Capacitor no hace falta
// (los archivos ya van en la app nativa).
const native = 'Capacitor' in window;
if ('serviceWorker' in navigator && import.meta.env.PROD && !native) {
  window.addEventListener('load', () => void navigator.serviceWorker.register('./sw.js'));
}
