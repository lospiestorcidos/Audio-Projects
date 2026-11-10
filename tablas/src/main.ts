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
// Ojo: @capacitor/core define window.Capacitor también en la web, así que no basta con que exista;
// hay que preguntarle si de verdad es la app nativa.
const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
const native = !!cap?.isNativePlatform?.();
if ('serviceWorker' in navigator && import.meta.env.PROD && !native) {
  window.addEventListener('load', () => void navigator.serviceWorker.register('./sw.js'));
}
