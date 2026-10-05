import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectsGallery } from "@/components/projects/ProjectsGallery";
import { RichText } from "@/components/ui/RichText";
import { getAllProjectsWithPreviews, getCategories } from "@/lib/projects";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projektid",
  description:
    "Eramud, korterid, ärihooned ja kõrvalhooned — vundamendist võtmete üleandmiseni. Vaata Hansaluxi valminud töid üle Eesti.",
  alternates: { canonical: "/projektid" },
};

// Data is cached at the query layer (see lib/projects.ts); this stays dynamic
// so the page never depends on database access at build time.
export const dynamic = "force-dynamic";

export default async function ProjektidPage() {
  const [projects, categories, c] = await Promise.all([
    getAllProjectsWithPreviews(),
    getCategories(),
    getContent(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Projektid"
        heading={<RichText value={c("projektid.heading")} />}
        description={c("projektid.text")}
      />

      <ProjectsGallery projects={projects} categories={categories} />

      <CtaBand
        heading="Sinu objekt võiks olla järgmine"
        secondaryLabel="Vaata teenuseid"
        secondaryHref="/teenused"
      />
    </>
  );
}
