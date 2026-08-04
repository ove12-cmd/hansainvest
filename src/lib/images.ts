import "server-only";
import { getStore } from "@netlify/blobs";
import { randomUUID } from "node:crypto";

// Site-scoped (not deploy-scoped) so uploaded images survive every redeploy —
// deploy-scoped stores are wiped on each new deploy.
const STORE_NAME = "project-images";

export function getProjectImagesStore() {
  return getStore(STORE_NAME);
}

export function blobUrl(key: string): string {
  return `/api/blobs/${key}`;
}

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const MAX_SIZE = 15 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15_000;

function isLocalPath(url: string): boolean {
  return url.startsWith("/");
}

/**
 * Resolves an image reference from a CSV row into a URL this app actually owns.
 * Local paths (already /api/blobs/... or /images/...) pass through unchanged.
 * Remote http(s) URLs are downloaded once and saved into the project-images
 * Blobs store, so the site never depends on a third-party host staying online.
 * Returns null if the URL is empty, invalid, or the download failed for any reason —
 * callers should treat that as "skip this image", not abort the whole import.
 */
export async function resolveProjectImage(url: string): Promise<string | null> {
  if (!url) return null;
  if (isLocalPath(url)) return url;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    console.warn(`[images] Invalid URL, skipping: ${url}`);
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    console.warn(`[images] Unsupported protocol, skipping: ${url}`);
    return null;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(parsed, { signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      console.warn(`[images] Fetch failed (${res.status}): ${url}`);
      return null;
    }

    const contentType = res.headers.get("content-type")?.split(";")[0]?.trim() ?? "";
    if (!ALLOWED_TYPES.has(contentType)) {
      console.warn(`[images] Unsupported content-type "${contentType}": ${url}`);
      return null;
    }

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.byteLength > MAX_SIZE) {
      console.warn(`[images] Too large (${buffer.byteLength} bytes), skipping: ${url}`);
      return null;
    }

    const key = randomUUID();
    await getProjectImagesStore().set(key, new Blob([buffer]), { metadata: { contentType } });

    return blobUrl(key);
  } catch (error) {
    console.warn(`[images] Download failed for ${url}:`, error);
    return null;
  }
}

/**
 * Runs `worker` over `items` with at most `concurrency` in flight at once.
 */
export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function run() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, run));
  return results;
}
