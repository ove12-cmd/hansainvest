import type { Metadata } from "next";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ProjectsGallery } from "@/components/projects/ProjectsGallery";
import { getAllProjects, getCategories } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projektid",
  description:
    "Eramud, korterid, ärihooned ja kõrvalhooned — vundamendist võtmete üleandmiseni. Vaata Hansaluxi valminud töid üle Eesti.",
  alternates: { canonical: "/projektid" },
};

// Project list is managed live via /admin — always fetch fresh, never cache at build time.
export const dynamic = "force-dynamic";

export default async function ProjektidPage() {
  const [projects, categories] = await Promise.all([getAllProjects(), getCategories()]);

  return (
    <>
      <PageHero
        eyebrow="Projektid"
        heading="Valminud tööd üle Eesti"
        description="Eramud, korterid, ärihooned ja kõrvalhooned — vundamendist võtmete üleandmiseni. Iga objekt on tehtud sama meeskonna ja sama standardiga."
      />

      <ProjectsGallery projects={projects} categories={categories} />

      <CtaBand
        heading="Sinu objekt võiks olla järgmine"
        secondaryLabel="Vaata teenuseid"
        secondaryHref="/uldehitus"
      />
    </>
  );
}
