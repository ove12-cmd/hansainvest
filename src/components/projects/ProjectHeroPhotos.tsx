"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/projects/Lightbox";

export function ProjectHeroPhotos({ images, title }: { images: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState(-1);

  if (images.length === 0) return null;

  return (
    <>
      <section className={`grid grid-cols-1 gap-3.5 ${images.length > 1 ? "lg:grid-cols-2" : ""}`}>
        {images.map((src, index) => (
          <div key={`${index}-${src}`} className="relative overflow-hidden rounded-panel bg-ink sm:aspect-square lg:aspect-auto lg:h-130">
            <Image
              src={src}
              alt={index === 0 ? `Peapilt — ${title}` : `Teine pilt — ${title}`}
              fill
              preload={index === 0}
              sizes={images.length > 1 ? "(min-width: 1024px) 50vw, 100vw" : "100vw"}
              className="object-cover object-[center_bottom] max-sm:static! max-sm:h-auto!"
            />
            <button
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Suurenda fotot ${index + 1} — ${title}`}
              aria-haspopup="dialog"
              className="absolute inset-0 flex cursor-zoom-in items-end justify-end rounded-panel p-3 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white sm:hidden"
            >
              <span className="grid size-11 place-items-center rounded-pill bg-ink/75 text-white">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="size-5">
                  <path d="M8 4H4v4m12-4h4v4M4 16v4h4m12-4v4h-4" />
                </svg>
              </span>
            </button>
          </div>
        ))}
      </section>

      {openIndex >= 0 && (
        <Lightbox
          images={images}
          title={title}
          index={openIndex}
          onClose={() => setOpenIndex(-1)}
          onNavigate={setOpenIndex}
        />
      )}
    </>
  );
}
