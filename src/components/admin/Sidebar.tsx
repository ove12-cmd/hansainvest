"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { logoutAction } from "@/lib/actions/auth";
import type { ProjectActivityItem, IncompleteProjectItem, ProjectStats, CategoryCount } from "@/lib/projects";

const MENU_TRANSITION_MS = 260;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("et-EE", { day: "numeric", month: "short" });
}

function ActivityLink({ item }: { item: ProjectActivityItem }) {
  return (
    <Link
      href={`/projektid/${item.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.08]"
    >
      <span className="truncate text-[13px] font-semibold">{item.title}</span>
      <span className="shrink-0 text-[11px] font-medium text-footer-copy">{formatDate(item.timestamp)}</span>
    </Link>
  );
}

function IncompleteLink({ item }: { item: IncompleteProjectItem }) {
  return (
    <Link
      href={`/admin?edit=${item.slug}`}
      title={item.reasons.join(", ")}
      className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.08]"
    >
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" aria-hidden="true" />
      <span className="min-w-0 flex-1 truncate text-[13px] font-semibold">{item.title}</span>
    </Link>
  );
}

function DisclosurePanel({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  if (count === 0) return null;

  return (
    <details open className="group rounded-xl bg-white/[0.06]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-[12.5px] font-bold uppercase tracking-wide text-footer-nav">
        <span className="truncate">{title}</span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-pill bg-white/10 px-1.5 py-0.5 text-[10px] text-footer-copy">{count}</span>
          <span className="text-footer-copy transition-transform duration-200 group-open:rotate-180">▾</span>
        </span>
      </summary>
      <div className="flex flex-col gap-0.5 px-1.5 pb-2.5">{children}</div>
    </details>
  );
}

function StatsPanel({ stats }: { stats: ProjectStats }) {
  const rows = [
    { label: "Projekti", value: stats.total },
    { label: "Esimesi", value: stats.featured },
    { label: "Kategooriat", value: stats.categories },
  ];

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.06] px-3.5 py-2.5"
        >
          <span className="text-[13px] font-semibold text-footer-nav">{row.label}</span>
          <span className="font-display text-base font-bold">{row.value}</span>
        </div>
      ))}
    </div>
  );
}

function CategoryBreakdown({ counts }: { counts: CategoryCount[] }) {
  if (counts.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-white/[0.06] p-3">
      <span className="text-[11px] font-bold uppercase tracking-wide text-footer-copy">Kategooriad</span>
      <div className="flex flex-col gap-1">
        {counts.map((c) => (
          <div key={c.category} className="flex items-center justify-between gap-2">
            <span className="min-w-0 flex-1 truncate text-[12.5px] font-semibold">{c.category}</span>
            <span className="shrink-0 rounded-pill bg-white/10 px-2 py-0.5 text-[11px] font-bold text-footer-copy">
              {c.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarNav({
  email,
  recentlyModified,
  recentlyAdded,
  stats,
  incomplete,
  categoryCounts,
}: {
  email?: string;
  recentlyModified: ProjectActivityItem | null;
  recentlyAdded: ProjectActivityItem[];
  stats: ProjectStats;
  incomplete: IncompleteProjectItem[];
  categoryCounts: CategoryCount[];
}) {
  return (
    <>
      <div className="no-scrollbar mb-4 flex min-h-0 flex-1 flex-col gap-3.5 overflow-y-auto overflow-x-hidden">
        <nav className="flex flex-col gap-1">
          <span className="rounded-xl bg-white/10 px-3.5 py-2.5 text-sm font-semibold">Projektid</span>
        </nav>

        <StatsPanel stats={stats} />

        <CategoryBreakdown counts={categoryCounts} />

        <div className="flex flex-col gap-2">
          <DisclosurePanel title="Vajab täiendamist" count={incomplete.length}>
            {incomplete.map((item) => (
              <IncompleteLink key={item.id} item={item} />
            ))}
          </DisclosurePanel>
          <DisclosurePanel title="Viimati muudetud" count={recentlyModified ? 1 : 0}>
            {recentlyModified && <ActivityLink item={recentlyModified} />}
          </DisclosurePanel>
          <DisclosurePanel title="Viimati lisatud" count={recentlyAdded.length}>
            {recentlyAdded.map((item) => (
              <ActivityLink key={item.id} item={item} />
            ))}
          </DisclosurePanel>
        </div>
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

type SidebarProps = {
  email?: string;
  recentlyModified: ProjectActivityItem | null;
  recentlyAdded: ProjectActivityItem[];
  stats: ProjectStats;
  incomplete: IncompleteProjectItem[];
  categoryCounts: CategoryCount[];
};

export function Sidebar({ email, recentlyModified, recentlyAdded, stats, incomplete, categoryCounts }: SidebarProps) {
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
        <div className="mb-6 flex items-center gap-2 px-2">
          <Logo variant="light" />
          <span className="rounded-pill bg-white/10 px-2.5 py-1 text-[10.5px] font-bold tracking-wide">ADMIN</span>
        </div>
        <SidebarNav
          email={email}
          recentlyModified={recentlyModified}
          recentlyAdded={recentlyAdded}
          stats={stats}
          incomplete={incomplete}
          categoryCounts={categoryCounts}
        />
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
            className={`flex max-h-[85vh] w-full max-w-[420px] flex-col gap-4 rounded-2xl bg-ink p-6 text-white transition-all duration-[260ms] ease-[cubic-bezier(.22,.61,.36,1)] ${
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
            <SidebarNav
              email={email}
              recentlyModified={recentlyModified}
              recentlyAdded={recentlyAdded}
              stats={stats}
              incomplete={incomplete}
              categoryCounts={categoryCounts}
            />
          </div>
        </div>
      )}
    </>
  );
}
