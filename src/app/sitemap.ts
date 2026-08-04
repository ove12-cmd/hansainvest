import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { getAllProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/meist`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/uldehitus`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/projektid`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/kontakt`, changeFrequency: "yearly", priority: 0.6 },
  ];

  const projects = await getAllProjects();
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${SITE_URL}/projektid/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...projectRoutes];
}
