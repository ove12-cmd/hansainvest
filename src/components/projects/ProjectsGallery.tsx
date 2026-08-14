"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectCardPreview } from "@/lib/projects";

const PAGE_SIZE = 12;
const CATEGORY_PARAM = "kategooria";
const PAGE_PARAM = "lehekylg";

export function ProjectsGallery({
  projects,
  categories,
}: {
  projects: ProjectCardPreview[];
  categories: string[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const allCategories = ["Kõik", ...categories];

  const categoryParam = searchParams.get(CATEGORY_PARAM);
  const active = categoryParam && allCategories.includes(categoryParam) ? categoryParam : "Kõik";

  const pageParam = Number(searchParams.get(PAGE_PARAM));
  const requestedPage = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const visible = active === "Kõik" ? projects : projects.filter((p) => p.category === active);
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const paged = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const categoryCounts = new Map<string, number>();
  for (const p of projects) {
    categoryCounts.set(p.category, (categoryCounts.get(p.category) ?? 0) + 1);
  }

  function updateParams(next: { category?: string; page?: number }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.category !== undefined) {
      if (next.category === "Kõik") params.delete(CATEGORY_PARAM);
      else params.set(CATEGORY_PARAM, next.category);
      params.delete(PAGE_PARAM);
    }

    if (next.page !== undefined) {
      if (next.page <= 1) params.delete(PAGE_PARAM);
      else params.set(PAGE_PARAM, String(next.page));
    }

    const query = params.toString();
    window.history.pushState(null, "", `${pathname}${query ? `?${query}` : ""}`);
  }

  return (
    <section aria-labelledby="projektid-galerii" className="rounded-panel bg-white p-8 sm:p-12">
      <h2 id="projektid-galerii" className="sr-only">
        Projektide galerii
      </h2>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtreeri projekti liigi järgi">
          {allCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => updateParams({ category: cat })}
              aria-pressed={active === cat}
              className={`inline-flex items-center gap-1.5 rounded-pill px-4.5 py-2.5 text-[13.5px] font-semibold transition-all duration-200 active:scale-95 ${
                active === cat ? "bg-ink text-white" : "bg-panel hover:bg-border-soft"
              }`}
            >
              {cat}
              <span className="text-[11px] font-bold opacity-55">
                {cat === "Kõik" ? projects.length : categoryCounts.get(cat) ?? 0}
              </span>
            </button>
          ))}
        </div>
        <span className="text-[13.5px] font-semibold text-muted-3">
          {visible.length} {visible.length === 1 ? "projekt" : "projekti"}
        </span>
      </div>

      {visible.length === 0 ? (
        <p className="p-12 text-center text-base font-medium text-muted-3">Selles kategoorias pole veel projekte.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {paged.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <nav aria-label="Projektide lehed" className="mt-10 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => updateParams({ page: currentPage - 1 })}
            disabled={currentPage === 1}
            aria-label="Eelmine lehekülg"
            className="flex items-center justify-center rounded-pill bg-panel px-4.5 py-2.5 transition-all duration-200 hover:bg-border-soft active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowIcon direction="left" className="h-2.5 w-2.5" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => updateParams({ page: num })}
              aria-current={currentPage === num ? "page" : undefined}
              className={`rounded-pill px-4.5 py-2.5 text-[13.5px] font-semibold transition-all duration-200 active:scale-95 ${
                currentPage === num ? "bg-ink text-white" : "bg-panel hover:bg-border-soft"
              }`}
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            onClick={() => updateParams({ page: currentPage + 1 })}
            disabled={currentPage === totalPages}
            aria-label="Järgmine lehekülg"
            className="flex items-center justify-center rounded-pill bg-panel px-4.5 py-2.5 transition-all duration-200 hover:bg-border-soft active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            <ArrowIcon className="h-2.5 w-2.5" />
          </button>
        </nav>
      )}
    </section>
  );
}
