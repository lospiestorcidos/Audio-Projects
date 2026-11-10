#!/bin/bash
# Prepara Granos como app nativa de iPad y abre el proyecto en Xcode.
# Uso: doble clic en este archivo (la primera vez: clic derecho › Abrir).

cd "$(dirname "$0")" || exit 1
# Al abrir desde el Finder, el PATH no incluye las rutas habituales de Node.
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

pausa() { echo; read -r -p "Pulsa Intro para cerrar. " _; }

if ! command -v node >/dev/null 2>&1; then
  echo "Falta Node.js. Se abre la página de descarga: instala la versión LTS"
  echo "y vuelve a hacer doble clic en este archivo."
  open "https://nodejs.org/es/download" 2>/dev/null
  pausa; exit 1
fi

if [ ! -d "/Applications/Xcode.app" ]; then
  echo "Falta Xcode. Se abre su página en la App Store (es gratis, tarda en descargar)."
  echo "Cuando termine, ábrelo una vez y vuelve a hacer doble clic en este archivo."
  open "macappstore://apps.apple.com/app/xcode/id497799835" 2>/dev/null
  pausa; exit 1
fi

echo "1/3 · Instalando dependencias…"
npm install || { echo "Error al instalar dependencias."; pausa; exit 1; }

echo "2/3 · Compilando Granos y copiándolo al proyecto de iPad…"
npm run ios || { echo "Error al compilar."; pausa; exit 1; }

echo "3/3 · Abriendo Xcode…"
npx cap open ios || open ios/App/App.xcodeproj

echo
echo "Listo. Sigue ahora los pasos de Xcode del README (apartado «App nativa»)."
pausa
