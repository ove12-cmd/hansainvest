import type { Metadata } from "next";
import { ContentForm } from "@/components/admin/ContentForm";
import { getSavedContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Admin — Sisu",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const saved = await getSavedContent();

  return (
    <>
      <div className="rounded-panel bg-white px-5 py-6 sm:px-8 sm:py-7">
        <h1 className="mb-1.5 font-display text-[28px] font-semibold tracking-tight">Sisu</h1>
        <p className="text-sm font-medium text-muted-2">Lehtede tekstid ja pildid</p>
      </div>

      <ContentForm saved={saved} />
    </>
  );
}
