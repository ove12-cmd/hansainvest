"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import type { ProjectSummary } from "@/lib/projects";

const PAGE_SIZE = 12;
const CATEGORY_PARAM = "kategooria";
const PAGE_PARAM = "lehekylg";

export function ProjectsGallery({ projects, categories }: { projects: ProjectSummary[]; categories: string[] }) {
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
            <li key={project.id}>
              <Link href={`/projektid/${project.slug}`} className="group flex flex-col gap-3.5">
                <span className="relative block aspect-4/3 overflow-hidden rounded-xl bg-panel">
                  {project.featured && (
                    <Badge variant="tint" dot={false} className="absolute left-3 top-3 z-10 shadow-sm">
                      Esiletõstetud
                    </Badge>
                  )}
                  {project.image1Url ? (
                    <Image
                      src={project.image1Url}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center px-4 text-center text-xs font-semibold text-muted-3">
                      {project.title}
                    </span>
                  )}
                  <span className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex translate-y-2 justify-end opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-pill bg-white px-3.5 py-1.5 text-xs font-bold text-ink shadow-sm">
                      Vaata →
                    </span>
                  </span>
                </span>
                <span className="flex items-baseline justify-between gap-3">
                  <span className="text-[17px] font-bold text-ink">{project.title}</span>
                  <span className="whitespace-nowrap rounded-pill bg-panel px-3 py-1.5 text-xs font-semibold text-muted-2 transition-colors duration-200 group-hover:bg-brand-tint group-hover:text-brand">
                    {project.location}
                  </span>
                </span>
              </Link>
            </li>
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
            className="rounded-pill bg-panel px-4.5 py-2.5 text-[13.5px] font-semibold transition-all duration-200 hover:bg-border-soft active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            ‹
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
            className="rounded-pill bg-panel px-4.5 py-2.5 text-[13.5px] font-semibold transition-all duration-200 hover:bg-border-soft active:scale-95 disabled:pointer-events-none disabled:opacity-40"
          >
            ›
          </button>
        </nav>
      )}
    </section>
  );
}
