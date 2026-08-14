"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Lightbox } from "@/components/projects/Lightbox";
import type { ProjectCardPreview } from "@/lib/projects";

export function ProjectCard({ project }: { project: ProjectCardPreview }) {
  const [openIndex, setOpenIndex] = useState(-1);

  // The main card photo is included too, so the lightbox can browse every
  // preview-available photo, not just the small strip below it.
  const lightboxImages = project.image1Url ? [project.image1Url, ...project.previewImages] : project.previewImages;

  return (
    <li>
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
              Vaata <ArrowIcon className="h-2.5 w-2.5" />
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

      {/* Desktop already lets people click through; on mobile — where the
          grid drops to one column and cards are the primary way to browse —
          a quick photo strip lets a visitor preview a project without
          leaving the list. */}
      {project.previewImages.length > 0 && (
        <div className="mt-2 grid grid-cols-4 gap-1.5 sm:hidden">
          {project.previewImages.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setOpenIndex(i + (project.image1Url ? 1 : 0))}
              className="relative block aspect-square overflow-hidden rounded-lg bg-panel"
            >
              <Image src={src} alt={`${project.title} — pilt ${i + 2}`} fill sizes="25vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {openIndex >= 0 && (
        <Lightbox
          images={lightboxImages}
          title={project.title}
          index={openIndex}
          onClose={() => setOpenIndex(-1)}
          onNavigate={setOpenIndex}
        />
      )}
    </li>
  );
}
