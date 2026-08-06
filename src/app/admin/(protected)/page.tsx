import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { getAllProjectsForAdmin, getCategories } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Admin — Projektid",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [projects, categories] = await Promise.all([getAllProjectsForAdmin(), getCategories()]);
  return <AdminDashboard projects={projects} categories={categories} />;
}
