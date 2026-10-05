// Browser-side image upload pipeline shared by every admin form.

// Real camera/phone photos (often 3-10MB+) were taking 10s+ to upload and
// frequently failing outright — measured upload time scales badly with file
// size against this backend, not just linearly. Downscaling and re-encoding
// client-side before upload keeps payloads small and reliable regardless of
// the original photo's size, and is good practice for a photo-heavy CMS
// either way (faster uploads, less Blobs storage, faster page loads).
const COMPRESS_MAX_DIMENSION = 2000;
const COMPRESS_QUALITY = 0.82;
const COMPRESS_SKIP_UNDER_BYTES = 350 * 1024;

export async function compressImage(file: File): Promise<File> {
  if (file.size <= COMPRESS_SKIP_UNDER_BYTES) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file; // unsupported/corrupt — let the server validate and reject as usual
  }

  try {
    const scale = Math.min(1, COMPRESS_MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", COMPRESS_QUALITY));
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } finally {
    bitmap.close();
  }
}

// Above roughly this many simultaneous /api/admin/upload requests, Netlify's
// function layer starts timing out some of them ("the edge function timed
// out") — the gallery field selecting many files at once was firing them
// all in parallel. Capping concurrency fixes small/synthetic-file batches,
// but larger sustained batches of real photos still see occasional failures
// — that looks like a request-volume-over-time limit rather than pure
// concurrency, so retries need real backoff (with jitter, so retries from
// several stalled uploads don't all land on the same instant) to ride out
// whatever cooldown window it needs.
export const GALLERY_UPLOAD_CONCURRENCY = 3;
const GALLERY_UPLOAD_MAX_ATTEMPTS = 5;
const GALLERY_UPLOAD_BASE_DELAY_MS = 1200;

export async function uploadImageWithRetry(file: File, onProgress?: (percent: number) => void): Promise<string> {
  for (let attempt = 1; attempt <= GALLERY_UPLOAD_MAX_ATTEMPTS; attempt++) {
    try {
      return await uploadImage(file, onProgress);
    } catch (e) {
      if (attempt === GALLERY_UPLOAD_MAX_ATTEMPTS) throw e;
      const backoff = GALLERY_UPLOAD_BASE_DELAY_MS * 2 ** (attempt - 1);
      const jitter = Math.random() * backoff * 0.3;
      await new Promise((r) => setTimeout(r, backoff + jitter));
    }
  }
  throw new Error("Üleslaadimine ebaõnnestus.");
}

// XMLHttpRequest (not fetch) so upload progress can be reported per file.
export function uploadImage(file: File, onProgress?: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let data: { url?: string; error?: string } = {};
      try {
        data = JSON.parse(xhr.responseText);
      } catch {
        // ignore — falls through to the generic error below
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.url) {
        resolve(data.url);
      } else {
        reject(new Error(data.error || "Üleslaadimine ebaõnnestus."));
      }
    };
    xhr.onerror = () => reject(new Error("Üleslaadimine ebaõnnestus."));
    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  });
}
