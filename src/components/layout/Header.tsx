"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { CONTACT, NAV_LINKS } from "@/lib/constants";
import { useScrolled } from "@/hooks/useScrolled";

const MENU_TRANSITION_MS = 260;

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [entered, setEntered] = useState(false);
  const scrolled = useScrolled();
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  function openMenu() {
    setMenuOpen(true);
    // Deferred a tick so the browser paints the collapsed state first, then transitions to entered.
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
      <header
        className={`sticky top-3.5 z-50 flex items-center justify-between gap-6 rounded-pill bg-white py-2 pr-2 pl-5 transition-shadow duration-300 ${
          scrolled ? "shadow-[0_8px_30px_rgba(0,0,0,0.10)]" : "shadow-[0_2px_14px_rgba(0,0,0,0.04)]"
        }`}
      >
        <Link href="/" className="group flex items-center gap-2">
          <Logo className="transition-transform duration-300 ease-out group-hover:scale-105" />
        </Link>

        <nav aria-label="Peamenüü" className="hidden lg:flex items-center gap-2 rounded-pill bg-panel p-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={`rounded-pill px-4 py-2 text-[13.5px] font-medium transition-all duration-200 ${
                isActive(link.href)
                  ? "bg-ink font-semibold text-white"
                  : "text-nav-inactive hover:bg-border-soft hover:text-ink"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <a
            href={CONTACT.phoneHref}
            className="whitespace-nowrap font-display text-[14.5px] font-semibold text-ink transition-colors duration-200 hover:text-brand"
          >
            {CONTACT.phone}
          </a>
          <Button href="/kontakt" variant="brand" size="sm">
            Küsi pakkumist
          </Button>
        </div>

        <button
          type="button"
          onClick={() => (menuOpen ? closeMenu() : openMenu())}
          aria-label={menuOpen ? "Sulge menüü" : "Ava menüü"}
          aria-expanded={menuOpen}
          className="flex lg:hidden h-11 w-11 flex-col items-center justify-center gap-1 rounded-pill bg-panel transition-transform duration-200 active:scale-90"
        >
          <span
            className={`block h-0.5 w-4 rounded-full bg-ink transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] ${
              entered ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-4 rounded-full bg-ink transition-all duration-200 ${
              entered ? "scale-x-0 opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-4 rounded-full bg-ink transition-transform duration-300 ease-[cubic-bezier(.22,.61,.36,1)] ${
              entered ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </button>
      </header>

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
            className={`flex w-full max-w-[520px] flex-col gap-1.5 rounded-2xl bg-white p-5 transition-all duration-[260ms] ease-[cubic-bezier(.22,.61,.36,1)] ${
              entered ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 pb-3.5">
              <span className="font-display text-[17px] font-bold">Menüü</span>
              <button
                type="button"
                onClick={closeMenu}
                aria-label="Sulge menüü"
                className="flex h-11 w-11 items-center justify-center rounded-pill bg-panel text-xl text-ink transition-transform duration-200 hover:rotate-90 active:scale-90"
              >
                ×
              </button>
            </div>
            {NAV_LINKS.filter((link) => link.href !== "/kontakt").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-xl p-4 text-[17px] transition-colors duration-200 hover:bg-panel active:scale-[0.98] ${
                  isActive(link.href) ? "bg-panel font-bold" : "font-semibold"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/kontakt"
              onClick={closeMenu}
              aria-current={isActive("/kontakt") ? "page" : undefined}
              className={`mt-1.5 rounded-pill border p-4 text-center text-[17px] font-semibold transition-colors duration-200 active:scale-[0.98] ${
                isActive("/kontakt") ? "border-ink bg-panel font-bold" : "border-border text-ink hover:border-ink hover:bg-panel"
              }`}
            >
              Kontakt
            </Link>
            <a
              href={CONTACT.phoneHref}
              className="rounded-pill bg-brand p-4 text-center text-base font-bold text-white transition-transform duration-200 active:scale-[0.98]"
            >
              Helista {CONTACT.phone}
            </a>
            <a
              href={CONTACT.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-pill bg-facebook p-4 text-center text-base font-bold text-white transition-colors duration-200 hover:bg-facebook-hover active:scale-[0.98]"
            >
              Facebook
            </a>
          </div>
        </div>
      )}
    </>
  );
}
