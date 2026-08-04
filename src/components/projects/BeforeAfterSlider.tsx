"use client";

import { useState } from "react";
import Image from "next/image";

export function BeforeAfterSlider({
  beforeImageUrl,
  afterImageUrl,
}: {
  beforeImageUrl: string;
  afterImageUrl: string;
}) {
  const [split, setSplit] = useState(50);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <span className="mb-4.5 inline-flex items-center gap-2 rounded-pill bg-brand-tint px-3.5 py-1.5 text-xs font-bold text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Enne ja pärast
          </span>
          <h2 className="font-display text-[28px] font-semibold leading-[1.1] tracking-tight sm:text-4xl">
            Lohista, et võrrelda
          </h2>
        </div>
        <span className="text-[13.5px] font-semibold text-muted-3">
          Enne {split}% · Pärast {100 - split}%
        </span>
      </div>

      <div className="relative h-105 overflow-hidden rounded-panel bg-panel">
        <div className="absolute inset-0">
          <Image src={afterImageUrl} alt="Pärast" fill sizes="100vw" className="object-cover object-[center_bottom]" />
        </div>
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}>
          <Image src={beforeImageUrl} alt="Enne" fill sizes="100vw" className="object-cover object-[center_bottom]" />
        </div>
        <div
          className="pointer-events-none absolute top-0 bottom-0 w-0.75 bg-brand"
          style={{ left: `${split}%` }}
        />
        <span className="pointer-events-none absolute left-4.5 top-4.5 rounded-pill bg-white/94 px-4 py-2 text-xs font-bold">
          Enne
        </span>
        <span className="pointer-events-none absolute right-4.5 top-4.5 rounded-pill bg-ink/86 px-4 py-2 text-xs font-bold text-white">
          Pärast
        </span>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={split}
          onChange={(e) => setSplit(Number(e.target.value))}
          aria-label="Enne ja pärast"
          className="absolute inset-x-0 bottom-1/2 h-8.5 w-full cursor-ew-resize appearance-none bg-transparent [&::-webkit-slider-thumb]:h-8.5 [&::-webkit-slider-thumb]:w-8.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-brand [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_4px_14px_rgba(0,0,0,0.25)] [&::-moz-range-thumb]:h-8.5 [&::-moz-range-thumb]:w-8.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-brand [&::-moz-range-thumb]:bg-white"
        />
      </div>
    </div>
  );
}
