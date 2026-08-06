"use client";

import { useActionState, useEffect, useState } from "react";
import Image from "next/image";
import { addProjectAction, updateProjectAction, type AddProjectState } from "@/app/admin/(protected)/actions";
import { slugify } from "@/lib/slugify";
import type { ProjectDetail } from "@/lib/projects";

const INITIAL_STATE: AddProjectState = {};

const FIELD_CLASSES = "rounded-xl border border-border-input px-3.5 py-3 text-[15px]";

function ImageSlot({ label, url, onUpload }: { label: string; url: string; onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Üleslaadimine ebaõnnestus.");
      onUpload(data.url);
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

export function ProjectForm({ project, onSaved }: { project?: ProjectDetail; onSaved?: () => void }) {
  const action = project ? updateProjectAction : addProjectAction;
  const [state, formAction, pending] = useActionState(action, INITIAL_STATE);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [image1Url, setImage1Url] = useState(project?.image1Url ?? "");
  const [image2Url, setImage2Url] = useState(project?.image2Url ?? "");

  const slugValue = slugTouched ? slug : slugify(title);

  useEffect(() => {
    if (state.success && project) onSaved?.();
  }, [state.success, project, onSaved]);

  return (
    <form action={formAction} className="rounded-panel bg-white p-5 sm:p-8">
      {project && <input type="hidden" name="id" value={project.id} />}
      <span className="mb-6 inline-flex items-center gap-2 rounded-pill bg-brand-tint px-3.5 py-1.5 text-xs font-bold text-brand">
        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        {project ? "Muuda projekti" : "Uus projekt"}
      </span>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-4.5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-slug" className="text-xs font-bold uppercase tracking-wide text-muted-3">
                Slug
              </label>
              <input
                id="f-slug"
                name="slug"
                type="text"
                placeholder="pooningu-valjaehitus"
                value={slugValue}
                onChange={(e) => {
                  setSlugTouched(true);
                  setSlug(e.target.value);
                }}
                className={`${FIELD_CLASSES} font-mono`}
              />
            </div>
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
            <div className="flex flex-col gap-1.5">
              <label htmlFor="f-category" className="text-xs font-bold uppercase tracking-wide text-muted-3">
                Kategooria
              </label>
              <input
                id="f-category"
                name="category"
                type="text"
                placeholder="nt Eramud"
                list="category-suggestions"
                defaultValue={project?.category}
                className={FIELD_CLASSES}
              />
              <datalist id="category-suggestions">
                <option value="Eramud" />
                <option value="Katused" />
                <option value="Fassaadid" />
                <option value="Siseviimistlus" />
                <option value="Ärihooned" />
              </datalist>
            </div>
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
