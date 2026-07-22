/**
 * Client-side compression before upload: phones shoot 5–12MB HEIC/JPEG;
 * a wedding gallery needs far less. Runs in the browser so venue-wifi uploads
 * stay fast and — because photos are stored as data URLs inside Firestore
 * (no paid Storage bucket) — small enough to fit a document.
 */
export async function compressImage(
  file: Blob,
  maxEdge = 1600,
  quality = 0.8,
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("not an image"));
      el.src = url;
    });
    const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (!blob) throw new Error("compression failed");
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Guarantee a blob is under `maxBytes` by re-compressing at progressively
 * smaller size/quality. A Firestore document is capped at 1MB and a data URL
 * is ~1.37× the binary, so the default ceiling keeps the encoded string
 * comfortably under the limit.
 */
export async function ensureUnder(blob: Blob, maxBytes = 680_000): Promise<Blob> {
  if (blob.size <= maxBytes) return blob;
  let current = blob;
  for (const [edge, q] of [
    [1440, 0.75],
    [1200, 0.7],
    [1000, 0.65],
    [800, 0.58],
    [640, 0.5],
  ] as const) {
    current = await compressImage(current, edge, q);
    if (current.size <= maxBytes) break;
  }
  return current;
}

export const blobToDataUrl = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("read failed"));
    r.readAsDataURL(blob);
  });
