"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { addProjectAction, updateProjectAction, type AddProjectState } from "@/app/admin/(protected)/actions";
import type { ProjectDetail } from "@/lib/projects";
import { ImageSlot } from "@/components/admin/ImageSlot";
import { compressImage, uploadImageWithRetry, GALLERY_UPLOAD_CONCURRENCY } from "@/lib/uploadImage";

const INITIAL_STATE: AddProjectState = {};

const FIELD_CLASSES = "rounded-xl border border-border-input px-3.5 py-3 text-[15px]";

const NEW_CATEGORY_VALUE = "__new__";

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
