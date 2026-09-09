"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SLIDE_DURATION_MS = 5000;

export function HeroSlider({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((i) => (i + 1) % images.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [images.length, cycleKey]);

  function goTo(index: number) {
    setActiveIndex(index);
    setCycleKey((k) => k + 1);
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-panel bg-ink sm:hidden">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={`${title} — foto ${i + 1}`}
          fill
          priority={i === 0}
          loading={i === 0 ? undefined : "eager"}
          sizes="100vw"
          className={`object-cover object-[center_bottom] transition-opacity duration-700 ease-out ${
            i === activeIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute inset-x-3 top-3 z-10 flex gap-1.5">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Vaata fotot ${i + 1}`}
              className="h-1 flex-1 overflow-hidden rounded-full bg-white/35"
            >
              {i < activeIndex ? (
                <span className="block h-full w-full rounded-full bg-white" />
              ) : i === activeIndex ? (
                <span
                  key={cycleKey}
                  className="block h-full rounded-full bg-white"
                  style={{ animation: `hero-slide-progress ${SLIDE_DURATION_MS}ms linear forwards` }}
                />
              ) : (
                <span className="block h-full w-0 rounded-full bg-white" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
