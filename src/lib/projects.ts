import "server-only";
import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { resolveProjectImage, mapWithConcurrency } from "@/lib/images";
import type { CsvProjectRow } from "@/lib/csv";
import type { Project } from "@/generated/prisma/client";

const IMPORT_CONCURRENCY = 5;
// Bounds concurrent image resolution *within* a single row too — a row with
// a large gallery was firing every one of its images at once via Promise.all,
// which combined with IMPORT_CONCURRENCY could spike well past what Netlify
// Blobs tolerates concurrently and start failing uploads (see GalleryField's
// upload path in ProjectForm.tsx for the same issue on the interactive side).
const IMAGE_RESOLVE_CONCURRENCY = 2;

// Public-facing reads are cached here (not via route-level static rendering)
// so pages never depend on database access at build time. Admin actions call
// revalidateTag(PROJECTS_TAG) after every write; the revalidate time below is
// just a safety net in case an invalidation is ever missed.
export const PROJECTS_TAG = "projects";
const CACHE_OPTIONS = { tags: [PROJECTS_TAG], revalidate: 3600 };

export type ProjectSummary = {
  id: string;
  slug: string;
  title: string;
  location: string;
  category: string;
  image1Url: string | null;
  featured: boolean;
  sort: number;
};

export type ProjectDetail = ProjectSummary & {
  image2Url: string | null;
  gallery: string[];
  works: string[];
  summary: string | null;
  description: string | null;
  propertyType: string | null;
  area: string | null;
  duration: string | null;
  completedYear: string | null;
  beforeImageUrl: string | null;
  afterImageUrl: string | null;
};

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function toSummary(project: Project): ProjectSummary {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    location: project.location,
    category: project.category,
    image1Url: project.image1Url,
    featured: project.featured,
    sort: project.sort,
  };
}

function toDetail(project: Project): ProjectDetail {
  return {
    ...toSummary(project),
    image2Url: project.image2Url,
    gallery: parseJsonArray(project.gallery),
    works: parseJsonArray(project.works),
    summary: project.summary,
    description: project.description,
    propertyType: project.propertyType,
    area: project.area,
    duration: project.duration,
    completedYear: project.completedYear,
    beforeImageUrl: project.beforeImageUrl,
    afterImageUrl: project.afterImageUrl,
  };
}

export const getAllProjects = unstable_cache(
  async (): Promise<ProjectSummary[]> => {
    const projects = await prisma.project.findMany({ orderBy: { sort: "asc" } });
    return projects.map(toSummary);
  },
  ["projects:getAllProjects"],
  CACHE_OPTIONS
);

// Full detail for every project, for the admin list — editing needs fields
// (works, image2Url) that the public-facing ProjectSummary doesn't carry.
export async function getAllProjectsForAdmin(): Promise<ProjectDetail[]> {
  const projects = await prisma.project.findMany({ orderBy: { sort: "asc" } });
  return projects.map(toDetail);
}

// Newest-first, for teasers like the landing page's "Viimati valminud tööd" —
// distinct from getAllProjects' admin-curated `sort` order used on /projektid.
export const getLatestProjects = unstable_cache(
  async (): Promise<ProjectSummary[]> => {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
    return projects.map(toSummary);
  },
  ["projects:getLatestProjects"],
  CACHE_OPTIONS
);

export const getCategories = unstable_cache(
  async (): Promise<string[]> => {
    const projects = await prisma.project.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    return projects.map((p) => p.category).filter(Boolean);
  },
  ["projects:getCategories"],
  CACHE_OPTIONS
);

export type ProjectActivityItem = {
  id: string;
  slug: string;
  title: string;
  timestamp: string;
};

function toActivityItem(project: Project, timestamp: Date): ProjectActivityItem {
  return { id: project.id, slug: project.slug, title: project.title, timestamp: timestamp.toISOString() };
}

// For the admin sidebar's "Viimati muudetud" panel.
export async function getMostRecentlyModifiedProject(): Promise<ProjectActivityItem | null> {
  const project = await prisma.project.findFirst({ orderBy: { updatedAt: "desc" } });
  return project ? toActivityItem(project, project.updatedAt) : null;
}

// For the admin sidebar's "Viimati lisatud" panel.
export async function getRecentlyAddedProjects(limit = 5): Promise<ProjectActivityItem[]> {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: limit });
  return projects.map((p) => toActivityItem(p, p.createdAt));
}

export type ProjectStats = { total: number; featured: number; categories: number };

// For the admin sidebar's quick-stats tiles.
export async function getProjectStats(): Promise<ProjectStats> {
  const [total, featured, categories] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { featured: true } }),
    getCategories(),
  ]);
  return { total, featured, categories: categories.length };
}

export type IncompleteProjectItem = ProjectActivityItem & { reasons: string[] };

// For the admin sidebar's "Vajab täiendamist" panel — flags projects missing
// fields that actually matter for how the public site renders them.
export async function getIncompleteProjects(): Promise<IncompleteProjectItem[]> {
  const projects = await prisma.project.findMany({ orderBy: { sort: "asc" } });

  const incomplete: IncompleteProjectItem[] = [];
  for (const project of projects) {
    const reasons: string[] = [];
    if (!project.image1Url) reasons.push("Esimene pilt puudub");
    if (parseJsonArray(project.works).length === 0) reasons.push("Tehtud tööd puuduvad");
    if (!project.category || project.category === "Muu") reasons.push("Kategooria puudub");
    if (reasons.length > 0) incomplete.push({ ...toActivityItem(project, project.updatedAt), reasons });
  }
  return incomplete;
}

export type CategoryCount = { category: string; count: number };

// For the admin sidebar's category breakdown.
export async function getCategoryCounts(): Promise<CategoryCount[]> {
  const projects = await prisma.project.findMany({ select: { category: true } });
  const counts = new Map<string, number>();
  for (const { category } of projects) {
    const key = category || "Muu";
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export const getProjectBySlug = unstable_cache(
  async (slug: string): Promise<ProjectDetail | null> => {
    const project = await prisma.project.findUnique({ where: { slug } });
    return project ? toDetail(project) : null;
  },
  ["projects:getProjectBySlug"],
  CACHE_OPTIONS
);

export const getRelatedProjects = unstable_cache(
  async (currentSlug: string, limit = 3): Promise<ProjectSummary[]> => {
    const projects = await prisma.project.findMany({
      where: { slug: { not: currentSlug } },
      orderBy: { sort: "asc" },
      take: limit,
    });
    return projects.map(toSummary);
  },
  ["projects:getRelatedProjects"],
  CACHE_OPTIONS
);

export type CreateProjectInput = {
  title: string;
  slug?: string;
  location: string;
  category: string;
  works?: string[];
  gallery?: string[];
  featured?: boolean;
  sort?: number;
  image1Url?: string;
  image2Url?: string;
};

export async function createProject(input: CreateProjectInput) {
  const slug = input.slug?.trim() || slugify(input.title);
  return prisma.project.create({
    data: {
      title: input.title,
      slug,
      location: input.location,
      category: input.category,
      works: JSON.stringify(input.works ?? []),
      gallery: JSON.stringify(input.gallery ?? []),
      featured: input.featured ?? false,
      sort: input.sort ?? 0,
      image1Url: input.image1Url || null,
      image2Url: input.image2Url || null,
    },
  });
}

export async function updateProject(id: string, input: CreateProjectInput) {
  const slug = input.slug?.trim() || slugify(input.title);
  return prisma.project.update({
    where: { id },
    data: {
      title: input.title,
      slug,
      location: input.location,
      category: input.category,
      works: JSON.stringify(input.works ?? []),
      gallery: JSON.stringify(input.gallery ?? []),
      featured: input.featured ?? false,
      sort: input.sort ?? 0,
      image1Url: input.image1Url || null,
      image2Url: input.image2Url || null,
    },
  });
}

export async function deleteProject(id: string) {
  await prisma.project.delete({ where: { id } });
}

export type ImportProjectRowsResult = {
  count: number;
  failedImages: number;
};

export async function importProjectRows(rows: CsvProjectRow[]): Promise<ImportProjectRowsResult> {
  let failedImages = 0;

  await mapWithConcurrency(rows, IMPORT_CONCURRENCY, async (row) => {
    const imageUrls = [row.image1Url, row.image2Url, ...row.gallery];
    const [image1Url, image2Url, ...gallery] = await mapWithConcurrency(
      imageUrls,
      IMAGE_RESOLVE_CONCURRENCY,
      (url) => resolveProjectImage(url)
    );

    if (row.image1Url && !image1Url) failedImages++;
    if (row.image2Url && !image2Url) failedImages++;
    const resolvedGallery = gallery.filter((url): url is string => {
      if (url) return true;
      failedImages++;
      return false;
    });

    const data = {
      title: row.title,
      location: row.location,
      category: row.category,
      image1Url,
      image2Url,
      works: JSON.stringify(row.works),
      gallery: JSON.stringify(resolvedGallery),
      featured: row.featured,
      sort: row.sort,
    };

    await prisma.project.upsert({
      where: { slug: row.slug },
      update: data,
      create: { ...data, slug: row.slug },
    });
  });

  return { count: rows.length, failedImages };
}
