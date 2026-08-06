"use client";

import { useEffect } from "react";

const AUTO_CLOSE_MS = 1000;

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-toast-in fixed bottom-5 right-5 z-[300] w-[min(320px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl bg-ink text-white shadow-xl"
    >
      <div className="flex items-start justify-between gap-3 px-4.5 py-3.5">
        <span className="text-[13.5px] font-semibold">{message}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Sulge teavitus"
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm leading-none text-white transition-colors hover:bg-white/20"
        >
          ×
        </button>
      </div>
      <div className="h-1 w-full bg-white/10">
        <div className="h-full bg-brand" style={{ animation: `toast-progress ${AUTO_CLOSE_MS}ms linear forwards` }} />
      </div>
    </div>
  );
}
