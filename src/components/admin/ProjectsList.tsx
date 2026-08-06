"use client";

import { useMemo, useState, useTransition } from "react";
import { deleteProjectAction } from "@/app/admin/(protected)/actions";
import type { ProjectDetail } from "@/lib/projects";

// xl: (not lg:) — the sidebar reappears at lg (1024px) and this grid's column
// minimums need more headroom than that leaves, especially on 1024px-wide tablets.
const GRID_COLS = "xl:grid-cols-[44px_minmax(170px,2fr)_minmax(110px,1fr)_minmax(80px,0.7fr)_60px_112px]";

type FeaturedSort = "desc" | "asc" | null;

function imageCount(project: ProjectDetail) {
  return (project.image1Url ? 1 : 0) + (project.image2Url ? 1 : 0) + project.gallery.length;
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M4 6h12M8 6V4.5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V6M8.5 9.5v5M11.5 9.5v5M5.5 6l.6 9.4a1 1 0 0 0 1 .9h5.8a1 1 0 0 0 1-.9L14.5 6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function nextFeaturedSort(current: FeaturedSort): FeaturedSort {
  if (current === null) return "desc";
  if (current === "desc") return "asc";
  return null;
}

function featuredSortLabel(sort: FeaturedSort) {
  if (sort === "desc") return "↓";
  if (sort === "asc") return "↑";
  return "⇅";
}

export function ProjectsList({
  projects,
  onEdit,
  onDeleted,
}: {
  projects: ProjectDetail[];
  onEdit: (project: ProjectDetail) => void;
  onDeleted: (title: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [featuredSort, setFeaturedSort] = useState<FeaturedSort>(null);

  function handleDelete(id: string, title: string) {
    if (!window.confirm(`Kustutada projekt "${title}"?`)) return;
    startTransition(async () => {
      await deleteProjectAction(id);
      onDeleted(title);
    });
  }

  function toggleFeaturedSort() {
    setFeaturedSort(nextFeaturedSort);
  }

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = q
      ? projects.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.location.toLowerCase().includes(q) ||
            p.slug.toLowerCase().includes(q)
        )
      : projects;

    if (featuredSort) {
      const dir = featuredSort === "desc" ? 1 : -1;
      list = [...list].sort((a, b) => dir * (Number(b.featured) - Number(a.featured)));
    }
    return list;
  }, [projects, query, featuredSort]);

  return (
    <div className="rounded-panel bg-white px-5 pb-4 pt-2 sm:px-8 sm:pb-6">
      <div className="flex flex-wrap items-center gap-3 border-b border-border-soft py-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Otsi nime, asukoha või slugi järgi…"
          aria-label="Otsi projekte"
          className="min-w-0 flex-1 rounded-pill border border-border-input bg-panel px-4 py-2 text-[13.5px] sm:max-w-80"
        />
        <button
          type="button"
          onClick={toggleFeaturedSort}
          className="shrink-0 rounded-pill bg-panel px-4 py-2 text-xs font-semibold text-muted transition-colors hover:bg-border-soft"
        >
          Esimene {featuredSortLabel(featuredSort)}
        </button>
        {query && (
          <span className="shrink-0 text-xs font-medium text-muted-3">
            {visible.length} / {projects.length}
          </span>
        )}
      </div>

      <div className={`hidden items-center gap-3.5 border-b border-border-soft py-4.5 xl:grid ${GRID_COLS}`}>
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-muted-3">Sort</span>
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-muted-3">Nimi / slug</span>
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-muted-3">Asukoht</span>
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-muted-3">Sisu</span>
        <button
          type="button"
          onClick={toggleFeaturedSort}
          className="flex items-center gap-1 text-[11.5px] font-bold uppercase tracking-wide text-muted-3 transition-colors hover:text-ink"
        >
          Esimene <span aria-hidden="true">{featuredSortLabel(featuredSort)}</span>
        </button>
        <span className="text-right text-[11.5px] font-bold uppercase tracking-wide text-muted-3">Tegevused</span>
      </div>

      {visible.length === 0 && (
        <p className="py-10 text-center text-sm font-medium text-muted-3">Ei leidnud otsingule vastavaid projekte.</p>
      )}

      {visible.map((project) => {
        const count = imageCount(project);
        return (
          <div
            key={project.id}
            className={`flex flex-col gap-3 border-b border-[#F4F4F2] py-4 last:border-b-0 xl:grid xl:items-center xl:gap-3.5 xl:py-3.5 ${GRID_COLS}`}
          >
            <div className="flex items-center gap-3 xl:contents">
              <span className="font-display text-[13.5px] font-bold text-muted-3">{project.sort}</span>
              <span className="min-w-0 flex-1 overflow-hidden">
                <span className="block truncate text-[15.5px] font-bold">{project.title}</span>
                <span className="block truncate text-xs font-medium text-muted-4">/{project.slug}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 xl:contents">
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-4 xl:hidden">Asukoht:</span>
              <span className="truncate text-sm font-medium text-muted">{project.location}</span>
            </div>
            <div className="flex items-center gap-1.5 xl:contents">
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-4 xl:hidden">Sisu:</span>
              <span className="text-xs font-semibold text-muted-3">
                {count > 0 ? `${count} ${count === 1 ? "pilt" : "pilti"}` : "—"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 xl:justify-center">
              <span className="text-[11px] font-bold uppercase tracking-wide text-muted-4 xl:hidden">Esimene:</span>
              <span
                title={project.featured ? "Esimeseks pandud" : "Ei ole esimene"}
                className={`text-base ${project.featured ? "text-brand" : "text-muted-5"}`}
                aria-hidden="true"
              >
                {project.featured ? "★" : "☆"}
              </span>
              <span className="sr-only">{project.featured ? "Esimeseks pandud" : "Ei ole esimene"}</span>
            </div>
            <span className="flex justify-start gap-2 xl:justify-end">
              <button
                type="button"
                onClick={() => onEdit(project)}
                className="rounded-pill bg-panel px-3.5 py-2 text-xs font-semibold text-ink"
              >
                Muuda
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDelete(project.id, project.title)}
                aria-label={`Kustuta projekt "${project.title}"`}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-pill bg-brand-tint text-brand transition-colors hover:bg-brand hover:text-white disabled:opacity-50"
              >
                <TrashIcon />
              </button>
            </span>
          </div>
        );
      })}
    </div>
  );
}
