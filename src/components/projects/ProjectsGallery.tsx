"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectCardPreview } from "@/lib/projects";

const PAGE_SIZE = 12;
const CATEGORY_PARAM = "kategooria";
const PAGE_PARAM = "lehekylg";
const SEARCH_PARAM = "otsi";
const SORT_PARAM = "sorteeri";

type SortOption =
  | "vaikimisi"
  | "esiletostetud"
  | "viimati-valminud"
  | "esimesena-valminud"
  | "alfabeet"
  | "asukoht";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "vaikimisi", label: "Vaikimisi" },
  { value: "esiletostetud", label: "Esiletõstetud" },
  { value: "viimati-valminud", label: "Viimati valminud" },
  { value: "esimesena-valminud", label: "Kõige esimesena valminud" },
  { value: "alfabeet", label: "Tähestik A-Z" },
  { value: "asukoht", label: "Asukoht" },
];

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

  const search = searchParams.get(SEARCH_PARAM) ?? "";

  const sortParam = searchParams.get(SORT_PARAM);
  const sort: SortOption = SORT_OPTIONS.some((o) => o.value === sortParam) ? (sortParam as SortOption) : "vaikimisi";

  const pageParam = Number(searchParams.get(PAGE_PARAM));
  const requestedPage = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

  const byCategory = active === "Kõik" ? projects : projects.filter((p) => p.category === active);

  const query = search.trim().toLowerCase();
  const bySearch = query
    ? byCategory.filter((p) => `${p.title} ${p.location}`.toLowerCase().includes(query))
    : byCategory;

  const visible = [...bySearch];
  if (sort === "esiletostetud") visible.sort((a, b) => Number(b.featured) - Number(a.featured));
  else if (sort === "viimati-valminud")
    visible.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  else if (sort === "esimesena-valminud")
    visible.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  else if (sort === "alfabeet") visible.sort((a, b) => a.title.localeCompare(b.title, "et"));
  else if (sort === "asukoht") visible.sort((a, b) => a.location.localeCompare(b.location, "et"));

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(requestedPage, totalPages);
  const paged = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const categoryCounts = new Map<string, number>();
  for (const p of projects) {
    categoryCounts.set(p.category, (categoryCounts.get(p.category) ?? 0) + 1);
  }

  function updateParams(next: { category?: string; page?: number; search?: string; sort?: SortOption }) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.category !== undefined) {
      if (next.category === "Kõik") params.delete(CATEGORY_PARAM);
      else params.set(CATEGORY_PARAM, next.category);
      params.delete(PAGE_PARAM);
    }

    if (next.search !== undefined) {
      if (next.search.trim()) params.set(SEARCH_PARAM, next.search);
      else params.delete(SEARCH_PARAM);
      params.delete(PAGE_PARAM);
    }

    if (next.sort !== undefined) {
      if (next.sort === "vaikimisi") params.delete(SORT_PARAM);
      else params.set(SORT_PARAM, next.sort);
      params.delete(PAGE_PARAM);
    }

    if (next.page !== undefined) {
      if (next.page <= 1) params.delete(PAGE_PARAM);
      else params.set(PAGE_PARAM, String(next.page));
    }

    const q = params.toString();
    window.history.pushState(null, "", `${pathname}${q ? `?${q}` : ""}`);
  }

  return (
    <section aria-labelledby="projektid-galerii" className="rounded-panel bg-white p-8 sm:p-12">
      <h2 id="projektid-galerii" className="sr-only">
        Projektide galerii
      </h2>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-6">
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

      <div className="mb-8 flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[200px] flex-1">
          <input
            type="search"
            defaultValue={search}
            onChange={(e) => updateParams({ search: e.target.value })}
            placeholder="Otsi nime või asukoha järgi…"
            aria-label="Otsi projekti"
            className="w-full rounded-pill border border-border-input bg-white px-4.5 py-2.5 text-[13.5px] font-medium outline-none transition-colors duration-200 focus:border-ink"
          />
        </div>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => updateParams({ sort: e.target.value as SortOption })}
            aria-label="Sorteeri projekte"
            className="cursor-pointer appearance-none rounded-pill border border-border-input bg-white py-2.5 pl-4.5 pr-10 text-[13.5px] font-semibold text-ink outline-none transition-colors duration-200 hover:border-ink focus:border-ink"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ArrowIcon className="pointer-events-none absolute right-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rotate-90 text-muted-3" />
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="p-12 text-center text-base font-medium text-muted-3">
          {query ? "Sellele otsingule vastavaid projekte ei leitud." : "Selles kategoorias pole veel projekte."}
        </p>
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
