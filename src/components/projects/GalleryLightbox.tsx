"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function GalleryLightbox({ images, title }: { images: string[]; title: string }) {
  const [openIndex, setOpenIndex] = useState(-1);
  const isOpen = openIndex >= 0;

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIndex(-1);
      if (e.key === "ArrowRight") setOpenIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, images.length]);

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

      {isOpen && (
        <div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-4 bg-[#0c0c0e]/92 p-4 sm:gap-5 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Galerii"
          onClick={() => setOpenIndex(-1)}
        >
          <div className="flex w-full max-w-4xl items-center justify-between">
            <span className="text-sm font-semibold text-white">
              {openIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setOpenIndex(-1)}
              aria-label="Sulge"
              className="flex h-11 w-11 items-center justify-center rounded-pill bg-white/[0.14] text-xl text-white"
            >
              ×
            </button>
          </div>
          <div
            className="relative aspect-16/10 w-full max-w-4xl overflow-hidden rounded-panel bg-[#1c1c20]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[openIndex]}
              alt={`${title} — foto ${openIndex + 1}`}
              fill
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setOpenIndex((i) => (i - 1 + images.length) % images.length)}
              aria-label="Eelmine"
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill bg-white/[0.14] text-xl text-white backdrop-blur-sm sm:left-4 sm:h-12 sm:w-12"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => setOpenIndex((i) => (i + 1) % images.length)}
              aria-label="Järgmine"
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill bg-white/[0.14] text-xl text-white backdrop-blur-sm sm:right-4 sm:h-12 sm:w-12"
            >
              →
            </button>
          </div>
        </div>
      )}
    </>
  );
}
