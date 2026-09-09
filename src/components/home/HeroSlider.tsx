"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const SLIDE_DURATION_MS = 5000;

function PauseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className={className}>
      <rect x="2" y="1.5" width="2.5" height="9" rx="0.75" />
      <rect x="7.5" y="1.5" width="2.5" height="9" rx="0.75" />
    </svg>
  );
}

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M2.5 1.3a.75.75 0 0 1 1.14-.64l6.5 4.2a.75.75 0 0 1 0 1.28l-6.5 4.2A.75.75 0 0 1 2.5 9.7Z" />
    </svg>
  );
}

export function HeroSlider({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [cycleKey, setCycleKey] = useState(0);
  const [paused, setPaused] = useState(false);

  const remainingRef = useRef(SLIDE_DURATION_MS);
  const slideStartRef = useRef(0);

  useEffect(() => {
    if (images.length <= 1 || paused) return;
    slideStartRef.current = Date.now();
    const timer = setTimeout(() => {
      remainingRef.current = SLIDE_DURATION_MS;
      setActiveIndex((i) => (i + 1) % images.length);
    }, remainingRef.current);
    return () => clearTimeout(timer);
  }, [images.length, paused, activeIndex, cycleKey]);

  function goTo(index: number) {
    setActiveIndex(index);
    remainingRef.current = SLIDE_DURATION_MS;
    setCycleKey((k) => k + 1);
  }

  function togglePaused() {
    if (!paused) {
      const elapsed = Date.now() - slideStartRef.current;
      remainingRef.current = Math.max(SLIDE_DURATION_MS - elapsed, 0);
    }
    setPaused((p) => !p);
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
        <div className="absolute inset-x-3 top-3 z-10 flex items-center gap-2">
          <div className="flex flex-1 gap-1.5">
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
                    style={{
                      animation: `hero-slide-progress ${SLIDE_DURATION_MS}ms linear forwards`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                ) : (
                  <span className="block h-full w-0 rounded-full bg-white" />
                )}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={togglePaused}
            aria-label={paused ? "Jätka slaidiesitust" : "Peata slaidiesitus"}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors duration-200 hover:bg-black/45"
          >
            {paused ? <PlayIcon className="h-2.5 w-2.5" /> : <PauseIcon className="h-2.5 w-2.5" />}
          </button>
        </div>
      )}
    </div>
  );
}
