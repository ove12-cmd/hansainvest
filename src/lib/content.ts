import "server-only";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { CONTENT_DEFAULTS } from "@/lib/data/editable";

export const CONTENT_TAG = "site-content";

const readContent = unstable_cache(
  async (): Promise<Record<string, string>> => {
    const rows = await prisma.siteContent.findMany();
    return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  },
  ["site-content"],
  { tags: [CONTENT_TAG], revalidate: 3600 }
);

export type Content = (key: string) => string;

// `cache` dedupes the lookup across every section of a single render.
export const getContent = cache(async (): Promise<Content> => {
  const saved = await readContent();
  return (key) => saved[key]?.trim() || CONTENT_DEFAULTS[key] || "";
});

// Raw saved values (blanks included) — the admin form needs what's actually
// stored, not the default-substituted view the public site renders.
export async function getSavedContent(): Promise<Record<string, string>> {
  return readContent();
}

// One multi-row upsert rather than one round trip per field: ~30 sequential
// upserts against the hosted database overran Prisma's 5s transaction budget.
export async function saveContent(entries: Record<string, string>) {
  const rows = Object.entries(entries);
  if (rows.length === 0) return;

  const values = Prisma.join(rows.map(([key, value]) => Prisma.sql`(${key}, ${value}, NOW())`));
  await prisma.$executeRaw`
    INSERT INTO "SiteContent" ("key", "value", "updatedAt")
    VALUES ${values}
    ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = NOW()
  `;
}
