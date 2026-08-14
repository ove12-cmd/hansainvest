"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ArrowIcon } from "@/components/ui/ArrowIcon";

export function Lightbox({
  images,
  title,
  index,
  onClose,
  onNavigate,
}: {
  images: string[];
  title: string;
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [images.length, index, onClose, onNavigate]);

  return (
    <div
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center gap-4 bg-[#0c0c0e]/92 p-4 sm:gap-5 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Galerii"
      onClick={onClose}
    >
      <div className="flex w-full max-w-4xl items-center justify-between">
        <span className="text-sm font-semibold text-white">
          {index + 1} / {images.length}
        </span>
        <button
          type="button"
          onClick={onClose}
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
          key={index}
          src={images[index]}
          alt={`${title} — foto ${index + 1}`}
          fill
          loading="eager"
          sizes="(min-width: 1024px) 900px, 100vw"
          className="object-contain"
        />
        <button
          type="button"
          onClick={() => onNavigate((index - 1 + images.length) % images.length)}
          aria-label="Eelmine"
          className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill bg-white/[0.14] text-white backdrop-blur-sm sm:left-4 sm:h-12 sm:w-12"
        >
          <ArrowIcon direction="left" className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate((index + 1) % images.length)}
          aria-label="Järgmine"
          className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-pill bg-white/[0.14] text-white backdrop-blur-sm sm:right-4 sm:h-12 sm:w-12"
        >
          <ArrowIcon className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
