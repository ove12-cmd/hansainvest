import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Sidebar } from "@/components/admin/Sidebar";
import { getMostRecentlyModifiedProject, getRecentlyAddedProjects, getProjectStats } from "@/lib/projects";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.userId) {
    redirect("/admin/login");
  }

  const [recentlyModified, recentlyAdded, stats] = await Promise.all([
    getMostRecentlyModifiedProject(),
    getRecentlyAddedProjects(5),
    getProjectStats(),
  ]);

  return (
    <div className="flex min-h-screen flex-col gap-3.5 bg-surface p-3.5 lg:flex-row">
      <Sidebar email={session.email} recentlyModified={recentlyModified} recentlyAdded={recentlyAdded} stats={stats} />
      <main className="flex min-w-0 flex-1 flex-col gap-3.5">{children}</main>
    </div>
  );
}
