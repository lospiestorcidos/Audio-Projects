import type { CapacitorConfig } from '@capacitor/cli';

// Empaquetado nativo para iPadOS. El identificador es provisional: cámbialo por el de tu cuenta
// de desarrollador de Apple antes de firmar la app.
const config: CapacitorConfig = {
  appId: 'app.granos.synth',
  appName: 'Granos',
  webDir: 'dist',
  ios: {
    contentInset: 'never',
    scrollEnabled: false,
    backgroundColor: '#0b0d10',
  },
};

export default config;
