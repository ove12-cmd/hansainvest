import "server-only";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slugify";
import { resolveProjectImage, mapWithConcurrency } from "@/lib/images";
import type { CsvProjectRow } from "@/lib/csv";
import type { Project } from "@/generated/prisma/client";

const IMPORT_CONCURRENCY = 5;

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

export async function getAllProjects(): Promise<ProjectSummary[]> {
  const projects = await prisma.project.findMany({ orderBy: { sort: "asc" } });
  return projects.map(toSummary);
}

// Full detail for every project, for the admin list — editing needs fields
// (works, image2Url) that the public-facing ProjectSummary doesn't carry.
export async function getAllProjectsForAdmin(): Promise<ProjectDetail[]> {
  const projects = await prisma.project.findMany({ orderBy: { sort: "asc" } });
  return projects.map(toDetail);
}

// Newest-first, for teasers like the landing page's "Viimati valminud tööd" —
// distinct from getAllProjects' admin-curated `sort` order used on /projektid.
export async function getLatestProjects(): Promise<ProjectSummary[]> {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  return projects.map(toSummary);
}

export async function getCategories(): Promise<string[]> {
  const projects = await prisma.project.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return projects.map((p) => p.category).filter(Boolean);
}

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  const project = await prisma.project.findUnique({ where: { slug } });
  return project ? toDetail(project) : null;
}

export async function getRelatedProjects(currentSlug: string, limit = 3): Promise<ProjectSummary[]> {
  const projects = await prisma.project.findMany({
    where: { slug: { not: currentSlug } },
    orderBy: { sort: "asc" },
    take: limit,
  });
  return projects.map(toSummary);
}

export type CreateProjectInput = {
  title: string;
  slug?: string;
  location: string;
  category: string;
  works?: string[];
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
      gallery: JSON.stringify([]),
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
    const [image1Url, image2Url, ...gallery] = await Promise.all([
      resolveProjectImage(row.image1Url),
      resolveProjectImage(row.image2Url),
      ...row.gallery.map((url) => resolveProjectImage(url)),
    ]);

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
