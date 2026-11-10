// Codificación y decodificación WAV PCM de 16 bits (guardar capturas, exportar presets).

export function encodeWav(ch: Float32Array[], sr: number): ArrayBuffer {
  const n = ch[0].length, nc = ch.length;
  const buf = new ArrayBuffer(44 + n * nc * 2);
  const v = new DataView(buf);
  const str = (o: number, s: string) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); v.setUint32(4, 36 + n * nc * 2, true); str(8, 'WAVE'); str(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, nc, true);
  v.setUint32(24, sr, true); v.setUint32(28, sr * nc * 2, true); v.setUint16(32, nc * 2, true);
  v.setUint16(34, 16, true); str(36, 'data'); v.setUint32(40, n * nc * 2, true);
  let o = 44;
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < nc; c++) {
      const s = Math.max(-1, Math.min(1, ch[c][i]));
      v.setInt16(o, Math.round(s * 32767), true);
      o += 2;
    }
  }
  return buf;
}

/** Decodifica solo el WAV de 16 bits que genera encodeWav (para importar presets sin AudioContext). */
export function decodeWav16(buf: ArrayBuffer): { ch: Float32Array[]; sr: number } {
  const v = new DataView(buf);
  const nc = v.getUint16(22, true), sr = v.getUint32(24, true);
  const n = v.getUint32(40, true) / (nc * 2);
  const ch = Array.from({ length: nc }, () => new Float32Array(n));
  let o = 44;
  for (let i = 0; i < n; i++) for (let c = 0; c < nc; c++) { ch[c][i] = v.getInt16(o, true) / 32767; o += 2; }
  return { ch, sr };
}

/**
 * Lee un WAV muestra a muestra (sin remuestrear) y lo devuelve en mono. Hace falta para las tablas
 * de ondas, donde cada ciclo mide exactamente 2048 muestras. Admite PCM de 8/16/24/32 bits y float.
 * Devuelve null si no es un WAV que sepa leer.
 */
export function parseWavMono(buf: ArrayBuffer): Float32Array | null {
  const v = new DataView(buf);
  const tag = (o: number) => String.fromCharCode(v.getUint8(o), v.getUint8(o + 1), v.getUint8(o + 2), v.getUint8(o + 3));
  if (buf.byteLength < 44 || tag(0) !== 'RIFF' || tag(8) !== 'WAVE') return null;
  let fmt = 0, nc = 0, bits = 0, dataAt = -1, dataLen = 0;
  for (let o = 12; o + 8 <= buf.byteLength;) {
    const id = tag(o), len = v.getUint32(o + 4, true);
    if (id === 'fmt ') {
      fmt = v.getUint16(o + 8, true); nc = v.getUint16(o + 10, true); bits = v.getUint16(o + 22, true);
      if (fmt === 0xfffe && len >= 26) fmt = v.getUint16(o + 32, true); // WAVE_FORMAT_EXTENSIBLE
    } else if (id === 'data') { dataAt = o + 8; dataLen = Math.min(len, buf.byteLength - dataAt); break; }
    o += 8 + len + (len & 1);
  }
  const bytes = bits >> 3;
  if (dataAt < 0 || nc < 1 || (fmt !== 1 && fmt !== 3) || ![1, 2, 3, 4].includes(bytes)) return null;
  if (fmt === 3 && bytes !== 4) return null;
  const n = Math.floor(dataLen / (bytes * nc));
  const out = new Float32Array(n);
  for (let i = 0, o = dataAt; i < n; i++) {
    let acc = 0;
    for (let c = 0; c < nc; c++, o += bytes) {
      if (fmt === 3) acc += v.getFloat32(o, true);
      else if (bytes === 1) acc += (v.getUint8(o) - 128) / 128;
      else if (bytes === 2) acc += v.getInt16(o, true) / 32768;
      else if (bytes === 3) acc += ((v.getInt8(o + 2) << 16) | (v.getUint8(o + 1) << 8) | v.getUint8(o)) / 8388608;
      else acc += v.getInt32(o, true) / 2147483648;
    }
    out[i] = acc / nc;
  }
  return out;
}

export function bufToBase64(buf: ArrayBuffer): string {
  const b = new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return btoa(s);
}
export function base64ToBuf(s: string): ArrayBuffer {
  const bin = atob(s);
  const b = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
  return b.buffer;
}

/**
 * Entrega un archivo al usuario.
 *  - App nativa: lo escribe en la caché y abre la hoja de compartir ("Guardar en Archivos").
 *  - Navegador / PWA: descarga normal (en iPad acaba en Archivos › Descargas).
 */
export async function downloadBlob(blob: Blob, name: string): Promise<void> {
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  if (cap?.isNativePlatform?.()) {
    const { Filesystem, Directory } = await import('@capacitor/filesystem');
    const { Share } = await import('@capacitor/share');
    const data = bufToBase64(await blob.arrayBuffer());
    const file = await Filesystem.writeFile({ path: name, data, directory: Directory.Cache });
    await Share.share({ title: name, url: file.uri });
    return;
  }
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
