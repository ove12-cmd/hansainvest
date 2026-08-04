"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { logoutAction } from "@/lib/actions/auth";

const MENU_TRANSITION_MS = 260;

function SidebarNav({ email }: { email?: string }) {
  return (
    <>
      <div>
        <nav className="flex flex-col gap-1">
          <span className="rounded-xl bg-white/10 px-3.5 py-2.5 text-sm font-semibold">Projektid</span>
        </nav>
      </div>

      <div className="flex flex-col gap-2.5">
        <Link
          href="/"
          className="rounded-xl bg-white/[0.08] px-3.5 py-2.5 text-center text-[13.5px] font-semibold text-footer-nav transition-colors hover:bg-white/[0.14] hover:text-white"
        >
          Vaata veebilehte →
        </Link>
        <div className="flex items-center gap-2.5 px-2">
          <span className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-brand text-[13px] font-bold">
            {(email?.[0] ?? "M").toUpperCase()}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[13.5px] font-semibold">{email ?? "Administraator"}</span>
            <span className="block text-xs text-footer-copy">Administraator</span>
          </span>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-xl bg-white/[0.08] px-3.5 py-2.5 text-[13px] font-semibold text-footer-nav transition-colors hover:bg-white/[0.14] hover:text-white"
          >
            Logi välja
          </button>
        </form>
      </div>
    </>
  );
}

export function Sidebar({ email }: { email?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [entered, setEntered] = useState(false);

  function openMenu() {
    setMenuOpen(true);
    setTimeout(() => setEntered(true), 10);
  }

  function closeMenu() {
    setEntered(false);
    setTimeout(() => setMenuOpen(false), MENU_TRANSITION_MS);
  }

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <>
      {/* Desktop: persistent sidebar */}
      <aside className="sticky top-3.5 z-40 hidden h-[calc(100vh-28px)] w-62.5 shrink-0 flex-col justify-between rounded-panel bg-ink p-6 text-white lg:flex">
        <div>
          <div className="mb-6 flex items-center gap-2 px-2">
            <Logo variant="light" />
            <span className="rounded-pill bg-white/10 px-2.5 py-1 text-[10.5px] font-bold tracking-wide">ADMIN</span>
          </div>
        </div>
        <SidebarNav email={email} />
      </aside>

      {/* Mobile/tablet: slim top bar + drawer */}
      <div className="sticky top-3.5 z-40 flex items-center justify-between rounded-panel bg-ink px-5 py-3.5 text-white lg:hidden">
        <div className="flex items-center gap-2">
          <Logo variant="light" />
          <span className="rounded-pill bg-white/10 px-2.5 py-1 text-[10.5px] font-bold tracking-wide">ADMIN</span>
        </div>
        <button
          type="button"
          onClick={openMenu}
          aria-label="Ava menüü"
          aria-expanded={menuOpen}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-pill bg-white/10 transition-transform duration-200 active:scale-90"
        >
          <span className="block h-0.5 w-4 rounded-full bg-white" />
          <span className="block h-0.5 w-4 rounded-full bg-white" />
          <span className="block h-0.5 w-4 rounded-full bg-white" />
        </button>
      </div>

      {menuOpen && (
        <div
          className={`fixed inset-0 z-[200] flex items-start justify-center bg-black/55 p-3.5 backdrop-blur-sm transition-opacity duration-[260ms] ease-out lg:hidden ${
            entered ? "opacity-100" : "opacity-0"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Menüü"
          onClick={closeMenu}
        >
          <div
            className={`flex w-full max-w-[420px] flex-col gap-4 rounded-2xl bg-ink p-6 text-white transition-all duration-[260ms] ease-[cubic-bezier(.22,.61,.36,1)] ${
              entered ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Logo variant="light" />
                <span className="rounded-pill bg-white/10 px-2.5 py-1 text-[10.5px] font-bold tracking-wide">ADMIN</span>
              </div>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Sulge menüü"
                className="flex h-10 w-10 items-center justify-center rounded-pill bg-white/10 text-xl text-white transition-transform duration-200 hover:rotate-90 active:scale-90"
              >
                ×
              </button>
            </div>
            <SidebarNav email={email} />
          </div>
        </div>
      )}
    </>
  );
}
