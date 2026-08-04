"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ProjectSummary } from "@/lib/projects";

export function ProjectsGallery({ projects, categories }: { projects: ProjectSummary[]; categories: string[] }) {
  const allCategories = ["Kõik", ...categories];
  const [active, setActive] = useState("Kõik");
  const visible = active === "Kõik" ? projects : projects.filter((p) => p.category === active);

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
              onClick={() => setActive(cat)}
              aria-pressed={active === cat}
              className={`rounded-pill px-4.5 py-2.5 text-[13.5px] font-semibold transition-all duration-200 active:scale-95 ${
                active === cat ? "bg-ink text-white" : "bg-panel hover:bg-border-soft"
              }`}
            >
              {cat}
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
          {visible.map((project) => (
            <li key={project.id}>
              <Link href={`/projektid/${project.slug}`} className="group flex flex-col gap-3.5">
                <span className="relative block aspect-4/3 overflow-hidden rounded-xl bg-panel">
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
    </section>
  );
}
