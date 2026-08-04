@AGENTS.md

# BeBeauty Build System

Conventions for this project. Follow them on every task — new components, refactors, and audits.

## Stack

- **Next.js 16 (App Router)** · React 19 · TypeScript · Tailwind CSS v4.
- Not Vite, not the Pages Router. Routes live in `src/app/**/page.tsx`, layouts in `layout.tsx`.
- Per `AGENTS.md` above: this Next.js has breaking changes — read the relevant guide in `node_modules/next/dist/docs/` before writing framework code.

## Current state vs. target — read first

This document is the **target**, not a description of the code today. Known gaps:

- Styling is currently hand-written `bb-*` BEM CSS in `src/app/globals.css` + `src/app/shop/shop.css` (~3,600 lines); Tailwind is barely used.
- There are no shared `components/ui` primitives — e.g. the gold button (`bb-btn bb-btn--gold`) is copy-pasted 15+ times instead of a `<Button variant>`.

When you touch a component, migrate it toward these rules. Do **not** rewrite the whole codebase in one pass — flag large refactors and confirm scope first.

## 1. Core philosophy

- Style lives on shared components/utilities. Context never creates a one-off.
- Before creating a component or class, search for an existing match by **style/behavior**, not by page or section.
- One base pattern = one source of truth. Variants are props, never copy-pasted duplicates.
- If two elements share more than ~90% of their styling/behavior, they share a component; everything that differs is a prop.

## 2. Project structure

```
src/
├── app/                 # App Router: page.tsx, layout.tsx, route handlers, sitemap.ts, robots.ts
├── components/
│   ├── ui/              # primitives: Button, Heading, Text, Card, Badge, Input
│   └── [feature]/       # feature/section compositions, built from ui primitives
├── lib/                 # utils, constants, static data, API clients
└── hooks/               # shared client logic (useCart, etc.)
```

- One component = one file = one responsibility. File name matches the component (PascalCase).
- Static data (product variants, reviews, FAQ, steps) belongs in `lib/`, not as inline arrays in components.
- **Server Components by default.** Add `"use client"` only when a component needs state, effects, or browser APIs.

## 3. Styling

- Prefer Tailwind utilities in JSX. Reserve custom CSS for what utilities genuinely can't express (keyframe animation, complex pseudo-element art).
- Centralize the design scale in the Tailwind v4 theme (`@theme` in `globals.css`) — colors, type, spacing, radii. No arbitrary one-offs (`text-[22px]`, `mt-[13px]`) when a scale step is close enough.
- Shared visual patterns → a reusable component with a `variant` prop — never a duplicated className string, and never `PrimaryButton` / `SecondaryButtonRed`.
- Never name a class or prop after where it lives (`heroSize`, `footerButton`) — only what it is (`large`, `outline`).

## 4. Typography

- Define the full type scale in the Tailwind theme (size / weight / line-height / tracking per step).
- Route headings through a `<Heading level={1..6} variant>` primitive and body copy through `<Text variant>`, instead of re-declaring font styles per section. (The current `bb-*__title` / `__word` / `__name` / `__heading` sprawl — ~11 near-identical heading classes — is exactly what this replaces.)

## 5. Accessibility (non-negotiable)

- Semantic HTML: `<button>` not `<div onClick>`; correct `<nav>` / `<main>` / `<header>` / `<footer>` on **every** route.
- Meaningful `alt` on content images; `alt=""` only for purely decorative ones.
- Interactive elements are keyboard-navigable with visible focus states; inputs have an associated `<label>` (or `aria-label`).
- Sequential heading order (no h1 → h3 skips); exactly one `<h1>` per route.
- Text meets WCAG AA contrast.

## 6. Performance

- Images: always `next/image` (it handles lazy-loading, width/height, and WebP/AVIF). Add `priority` only to the LCP image. Do **not** hand-roll `<img loading="lazy">` with manual dimensions.
- Enable AVIF in `next.config.ts` (`images.formats: ["image/avif", "image/webp"]`).
- Code-split heavy client components with `next/dynamic` (not `React.lazy` + `Suspense`).
- Fonts: `next/font` only — it self-hosts, preloads, and sets `font-display: swap`. No external font CDNs.
- Avoid unnecessary re-renders; don't add a dependency if an existing one already covers the need.

## 7. SEO (public pages)

- Use the App Router Metadata API. Every route has a unique `title` and `description`.
- A `"use client"` page **cannot** export `metadata` — put it in that route's `layout.tsx` instead.
- Set `metadataBase` once (root layout); add `alternates.canonical` per route, and for any param/duplicate path.
- Open Graph + Twitter tags, with an OG image that actually exists in `public/`.
- Ship `src/app/sitemap.ts` and `src/app/robots.ts`.
- Add JSON-LD where content supports it: Product / Offer / AggregateRating, FAQPage, Organization, BreadcrumbList.
- Alt text doubles as an SEO signal — make it descriptive, not `"Tulemus 1"`.

## 8. State & data

- Local UI state → `useState` / `useReducer` in the component.
- Shared state → lift to the nearest common parent or a context/hook. Reach for global state only when genuinely needed.
- Data/config lives in `lib/` (or `services/`), not inline in components. Never fetch the same data in multiple components independently — share via a hook, cache, or server-side fetch.

## 9. Before creating anything new — checklist

1. Search `components/ui` for a match by style/behavior.
2. 90%+ identical → add a prop/variant, don't fork.
3. Create a new component only for a genuinely new pattern.
4. Never duplicate a component just to tweak color, size, or spacing.

## 10. Git

- Commits: `type: short description` (`feat: add product variant selector`, `fix: cart total rounding`, `refactor: consolidate button variants`).
- One logical change per commit — don't mix a refactor with a feature.
- Never commit `.env` or secrets. Branch before committing on the default branch; commit/push only when asked.

## 11. Audit output format

When asked to audit, report **before** making changes:

```
CODEBASE AUDIT

Duplicate / near-duplicate components or styles:
- [items]  → Consolidate to: <Component variant> or shared token
  → Used in: [file:line refs]

Proposed changes:
- [old] → [new]  (reason)

New components genuinely needed:
- [name]  (why it can't be a variant)

A11y / performance / SEO issues:
- [issue + file:line]
```

Never apply changes silently — list them first, especially anything touching shared components used across multiple routes.

## 12. Summary rule

> If two elements share more than ~90% of their styling or behavior, they share a component.
> Everything that differs is a prop/variant.
> Nothing is named after where it lives — only what it is or does.
