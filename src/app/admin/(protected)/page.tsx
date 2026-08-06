import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAllProjectsForAdmin, getCategories } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Admin — Projektid",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ edit?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  const [projects, categories, params] = await Promise.all([
    getAllProjectsForAdmin(),
    getCategories(),
    searchParams,
  ]);
  return <AdminDashboard projects={projects} categories={categories} initialEditSlug={params.edit} />;
}
