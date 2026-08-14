"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/projects/Lightbox";

export function GalleryLightbox({ images, title }: { images: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState(-1);

  if (images.length === 0) return null;

  return (
    <>
      <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        {images.map((src, i) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="block aspect-4/3 w-full cursor-zoom-in overflow-hidden rounded-panel bg-panel transition-transform duration-[450ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:-translate-y-1"
            >
              <Image src={src} alt={`${title} — foto ${i + 1}`} width={480} height={360} className="h-full w-full object-cover" />
            </button>
          </li>
        ))}
      </ul>

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
