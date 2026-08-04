"use client";

import { useTransition } from "react";
import { deleteProjectAction } from "@/app/admin/(protected)/actions";
import type { ProjectSummary } from "@/lib/projects";

// xl: (not lg:) — the sidebar reappears at lg (1024px) and this grid's column
// minimums need more headroom than that leaves, especially on 1024px-wide tablets.
const GRID_COLS = "xl:grid-cols-[44px_minmax(170px,2fr)_minmax(110px,1fr)_minmax(90px,0.8fr)_90px_130px]";

function metaLabel(project: ProjectSummary) {
  return project.image1Url ? "1 pilt" : "—";
}

export function ProjectsList({ projects }: { projects: ProjectSummary[] }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string, title: string) {
    if (!window.confirm(`Kustutada projekt "${title}"?`)) return;
    startTransition(() => {
      deleteProjectAction(id);
    });
  }

  return (
    <div className="rounded-panel bg-white px-5 pb-4 pt-2 sm:px-8 sm:pb-6">
      <div className={`hidden items-center gap-3.5 border-b border-border-soft py-4.5 xl:grid ${GRID_COLS}`}>
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-muted-3">Sort</span>
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-muted-3">Nimi / slug</span>
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-muted-3">Asukoht</span>
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-muted-3">Sisu</span>
        <span className="text-[11.5px] font-bold uppercase tracking-wide text-muted-3">Esimene</span>
        <span className="text-right text-[11.5px] font-bold uppercase tracking-wide text-muted-3">Tegevused</span>
      </div>
      {projects.map((project) => (
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
            <span className="text-xs font-semibold text-muted-3">{metaLabel(project)}</span>
          </div>
          <span
            className={`inline-block w-fit rounded-pill px-3 py-1.5 text-[11.5px] font-bold ${
              project.featured ? "bg-brand-tint text-brand" : "bg-panel text-muted-4"
            }`}
          >
            {project.featured ? "Esimeseks pandud" : "Ei ole esimene"}
          </span>
          <span className="flex justify-start gap-2 xl:justify-end">
            <button type="button" className="rounded-pill bg-panel px-3.5 py-2 text-xs font-semibold text-ink">
              Muuda
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => handleDelete(project.id, project.title)}
              className="rounded-pill bg-brand-tint px-3.5 py-2 text-xs font-semibold text-brand disabled:opacity-50"
            >
              Kustuta
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}
