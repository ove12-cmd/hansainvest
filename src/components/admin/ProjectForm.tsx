"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { addProjectAction, updateProjectAction, type AddProjectState } from "@/app/admin/(protected)/actions";
import type { ProjectDetail } from "@/lib/projects";

const INITIAL_STATE: AddProjectState = {};

const FIELD_CLASSES = "rounded-xl border border-border-input px-3.5 py-3 text-[15px]";

const NEW_CATEGORY_VALUE = "__new__";

// Real camera/phone photos (often 3-10MB+) were taking 10s+ to upload and
// frequently failing outright — measured upload time scales badly with file
// size against this backend, not just linearly. Downscaling and re-encoding
// client-side before upload keeps payloads small and reliable regardless of
// the original photo's size, and is good practice for a photo-heavy CMS
// either way (faster uploads, less Blobs storage, faster page loads).
const COMPRESS_MAX_DIMENSION = 2000;
const COMPRESS_QUALITY = 0.82;
const COMPRESS_SKIP_UNDER_BYTES = 350 * 1024;

async function compressImage(file: File): Promise<File> {
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
const GALLERY_UPLOAD_CONCURRENCY = 3;
const GALLERY_UPLOAD_MAX_ATTEMPTS = 5;
const GALLERY_UPLOAD_BASE_DELAY_MS = 1200;

async function uploadImageWithRetry(file: File, onProgress?: (percent: number) => void): Promise<string> {
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
function uploadImage(file: File, onProgress?: (percent: number) => void): Promise<string> {
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

function ImageSlot({ label, url, onUpload }: { label: string; url: string; onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      onUpload(await uploadImage(await compressImage(file)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Üleslaadimine ebaõnnestus.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-muted-3">{label}</span>
      <label className="relative flex aspect-4/3 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-panel">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {url ? (
          <Image src={url} alt={label} fill className="object-cover" />
        ) : (
          <span className="px-3 text-center text-xs font-semibold text-muted-3">
            {uploading ? "Laadin…" : "Lohista pilt siia"}
          </span>
        )}
      </label>
      {error && <span className="text-xs font-semibold text-brand">{error}</span>}
    </div>
  );
}

type PendingUpload = { name: string; progress: number; error?: string };

function GalleryUploadTile({
  upload,
  onDismiss,
}: {
  upload: PendingUpload;
  onDismiss: () => void;
}) {
  if (upload.error) {
    return (
      <div className="relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl bg-panel p-2">
        <span className="text-center text-[11px] font-semibold text-brand">{upload.error}</span>
        <button
          type="button"
          onClick={onDismiss}
          className="rounded-pill bg-white px-2.5 py-1 text-[10px] font-semibold text-ink"
        >
          Sulge
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl bg-panel p-2">
      <span className="w-full truncate px-1 text-center text-[10px] font-medium text-muted-4">{upload.name}</span>
      <div className="h-1.5 w-full max-w-14 overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-brand transition-[width] duration-150 ease-out"
          style={{ width: `${upload.progress}%` }}
        />
      </div>
      <span className="text-[10px] font-semibold text-muted-3">{upload.progress}%</span>
    </div>
  );
}

function GalleryField({
  urls,
  onChange,
}: {
  urls: string[];
  onChange: (updater: string[] | ((prev: string[]) => string[])) => void;
}) {
  const [pending, setPending] = useState<Record<string, PendingUpload>>({});

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    const queue = Array.from(files).map((file) => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    }));
    queue.forEach(({ file, id }) => {
      setPending((prev) => ({ ...prev, [id]: { name: file.name, progress: 0 } }));
    });

    async function uploadOne(file: File, id: string) {
      try {
        const compressed = await compressImage(file);
        const url = await uploadImageWithRetry(compressed, (progress) => {
          setPending((prev) => (prev[id] ? { ...prev, [id]: { ...prev[id], progress } } : prev));
        });
        onChange((prevUrls) => [...prevUrls, url]);
        setPending((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      } catch (e) {
        setPending((prev) => ({
          ...prev,
          [id]: { ...prev[id], error: e instanceof Error ? e.message : "Üleslaadimine ebaõnnestus." },
        }));
      }
    }

    let cursor = 0;
    async function worker() {
      while (cursor < queue.length) {
        const { file, id } = queue[cursor++];
        await uploadOne(file, id);
      }
    }

    const workerCount = Math.min(GALLERY_UPLOAD_CONCURRENCY, queue.length);
    for (let i = 0; i < workerCount; i++) worker();
  }

  function removeAt(index: number) {
    onChange((prev) => prev.filter((_, i) => i !== index));
  }

  function dismissPending(id: string) {
    setPending((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-wide text-muted-3">Galerii</label>
      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 lg:grid-cols-6">
        {urls.map((url, i) => (
          <div key={url + i} className="group relative aspect-square overflow-hidden rounded-xl bg-panel">
            <Image src={url} alt={`Galerii pilt ${i + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              aria-label="Eemalda pilt"
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-xs font-bold text-white transition-colors hover:bg-ink"
            >
              ×
            </button>
          </div>
        ))}

        {Object.entries(pending).map(([id, upload]) => (
          <GalleryUploadTile key={id} upload={upload} onDismiss={() => dismissPending(id)} />
        ))}

        <label className="relative flex aspect-square cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-panel">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            className="sr-only"
            onChange={(e) => {
              handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <span className="px-2 text-center text-xs font-semibold text-muted-3">+ Lisa pilte</span>
        </label>
      </div>
      <span className="text-xs font-medium text-muted-4">Saab valida korraga mitu pilti.</span>
    </div>
  );
}

function CategoryField({ categories, defaultValue }: { categories: string[]; defaultValue?: string }) {
  const knownCategories = defaultValue && !categories.includes(defaultValue) ? [defaultValue, ...categories] : categories;
  const [customMode, setCustomMode] = useState(knownCategories.length === 0);

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="f-category" className="text-xs font-bold uppercase tracking-wide text-muted-3">
        Kategooria
      </label>
      {customMode ? (
        <input
          id="f-category"
          name="category"
          type="text"
          required
          autoFocus
          placeholder="nt Ärihooned"
          className={FIELD_CLASSES}
        />
      ) : (
        <select
          id="f-category"
          name="category"
          defaultValue={defaultValue ?? knownCategories[0] ?? NEW_CATEGORY_VALUE}
          onChange={(e) => {
            if (e.target.value === NEW_CATEGORY_VALUE) setCustomMode(true);
          }}
          className={`${FIELD_CLASSES} bg-white`}
        >
          {knownCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
          <option value={NEW_CATEGORY_VALUE}>+ Uus kategooria…</option>
        </select>
      )}
    </div>
  );
}

export function ProjectForm({
  project,
  categories,
  onSaved,
}: {
  project?: ProjectDetail;
  categories: string[];
  onSaved?: () => void;
}) {
  const action = project ? updateProjectAction : addProjectAction;
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);
  const [title, setTitle] = useState(project?.title ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [image1Url, setImage1Url] = useState(project?.image1Url ?? "");
  const [image2Url, setImage2Url] = useState(project?.image2Url ?? "");
  const [gallery, setGallery] = useState<string[]>(project?.gallery ?? []);

  // onSaved is a fresh inline function on every AdminDashboard render. If the
  // "add" form stays open after success (unlike edit, which closes and
  // unmounts), depending on [state.success, onSaved] would re-fire this
  // effect every time onSaved's identity changes — including as a *result*
  // of calling it (showToast causes a parent re-render, which recreates
  // onSaved, which re-triggers this effect) — an infinite loop that replaced
  // the toast faster than it could ever paint. Depending on `state` itself
  // (a fresh object every dispatch, unaffected by parent re-renders) fires
  // exactly once per actual form submission, and a ref keeps onSaved current
  // without needing it in the dependency array.
  const onSavedRef = useRef(onSaved);
  useEffect(() => {
    onSavedRef.current = onSaved;
  });
  useEffect(() => {
    if (state.success) onSavedRef.current?.();
  }, [state]);

  return (
    <form action={formAction} className="rounded-panel bg-white p-5 sm:p-8">
      {/* Slug isn't user-editable — preserved as-is on edit, auto-derived from
          the title on create (see createProject). */}
      {project && <input type="hidden" name="slug" value={project.slug} />}
      {project && <input type="hidden" name="id" value={project.id} />}
      <span className="mb-6 inline-flex items-center gap-2 rounded-pill bg-brand-tint px-3.5 py-1.5 text-xs font-bold text-brand">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        {project ? "Muuda projekti" : "Uus projekt"}
      </span>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4.5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-title" className="text-xs font-bold uppercase tracking-wide text-muted-3">
              Nimi
            </label>
            <input
              id="f-title"
              name="title"
              type="text"
              required
              placeholder="nt Pööningu väljaehitus"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={FIELD_CLASSES}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.4fr_1fr_110px]">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-location" className="text-xs font-bold uppercase tracking-wide text-muted-3">
                Asukoht
              </label>
              <input
                id="f-location"
                name="location"
                type="text"
                required
                placeholder="nt Jõõpre"
                defaultValue={project?.location}
                className={FIELD_CLASSES}
              />
            </div>
            <CategoryField categories={categories} defaultValue={project?.category} />
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-sort" className="text-xs font-bold uppercase tracking-wide text-muted-3">
                Sort
              </label>
              <input
                id="f-sort"
                name="sort"
                type="number"
                placeholder="1"
                defaultValue={project?.sort}
                className={FIELD_CLASSES}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="f-works" className="text-xs font-bold uppercase tracking-wide text-muted-3">
              Tehtud tööd
            </label>
            <textarea
              id="f-works"
              name="works"
              rows={5}
              placeholder={"Üks töö rea kohta — nt\nSarikate tugevdamine\nSoojustus ja aurutõke\nSiseviimistlus"}
              defaultValue={project?.works.join("\n")}
              className={`${FIELD_CLASSES} resize-y leading-relaxed`}
            />
            <span className="text-xs font-medium text-muted-4">Iga rida muutub veebilehel nummerdatud punktiks.</span>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl bg-panel px-5 py-4">
            <span>
              <span className="block text-[15px] font-bold">Pane esimeseks</span>
              <span className="mt-0.5 block text-[13px] font-medium text-muted-2">
                Kuvatakse esilehel kangelaspildina.
              </span>
            </span>
            <input type="hidden" name="featured" value={featured ? "on" : ""} />
            <button
              type="button"
              onClick={() => setFeatured((v) => !v)}
              aria-pressed={featured}
              className={`flex h-7.5 w-13 items-center rounded-pill p-0.75 transition-colors duration-200 ${
                featured ? "bg-brand justify-end" : "bg-border justify-start"
              }`}
            >
              <span className="h-6 w-6 rounded-full bg-white" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          <input type="hidden" name="image1Url" value={image1Url} />
          <input type="hidden" name="image2Url" value={image2Url} />
          <ImageSlot label="Esimene pilt" url={image1Url} onUpload={setImage1Url} />
          <ImageSlot label="Teine pilt" url={image2Url} onUpload={setImage2Url} />
        </div>
      </div>

      <div className="mt-4.5 border-t border-border-soft pt-4.5">
        <input type="hidden" name="gallery" value={JSON.stringify(gallery)} />
        <GalleryField urls={gallery} onChange={setGallery} />
      </div>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-border-soft pt-6">
        <span className="text-[13.5px] font-medium text-muted-3">
          {state.error ?? (state.success ? "Salvestatud." : "Nimi ja asukoht on kohustuslikud.")}
        </span>
        <button
          type="submit"
          disabled={pending}
          className="rounded-pill bg-ink px-7.5 py-3 text-sm font-bold text-white transition-colors hover:bg-black disabled:opacity-60"
        >
          {pending ? "Salvestan…" : project ? "Salvesta muudatused" : "Lisa projekt"}
        </button>
      </div>
    </form>
  );
}
