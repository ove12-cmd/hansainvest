import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Sidebar } from "@/components/admin/Sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.userId) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col gap-3.5 bg-surface p-3.5 lg:flex-row">
      <Sidebar email={session.email} />
      <main className="flex min-w-0 flex-1 flex-col gap-3.5">{children}</main>
    </div>
  );
}
