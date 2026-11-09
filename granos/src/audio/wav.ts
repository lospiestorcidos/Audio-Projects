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
