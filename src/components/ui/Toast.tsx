"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const AUTO_CLOSE_MS = 1000;

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  // Rendered via a portal straight into document.body — mounted deep inside
  // AdminDashboard, a newly-inserted fixed-position element could end up in
  // the wrong compositor layer whenever it appears during the same render
  // pass as the (large, frequently-refreshing) projects list, only getting
  // painted after an unrelated scroll/repaint forced the browser to recheck.
  // SSR-safe portal mount detection has no effect-free equivalent: `document`
  // isn't available on the server, so the first client render must still
  // match the server's null output before flipping to the portal post-mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // onClose is a fresh inline function on every AdminDashboard render; keeping
  // it in the effect's dependency array reset this timer on every one of
  // those re-renders (which happen for reasons unrelated to this toast),
  // so it could end up never firing. Track the latest callback in a ref
  // instead, and only ever start the timer once, on mount.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });
  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current(), AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return createPortal(
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
        <div
          className="h-full bg-green-500"
          style={{ animation: `toast-progress ${AUTO_CLOSE_MS}ms linear forwards` }}
        />
      </div>
    </div>,
    document.body
  );
}
