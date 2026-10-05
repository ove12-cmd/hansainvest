import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceDetailRow } from "@/components/sections/ServiceDetailRow";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { RichText } from "@/components/ui/RichText";
import { SERVICES_DETAIL } from "@/lib/data/services";
import { getContent } from "@/lib/content";
import { parseList } from "@/lib/data/editable";

export const metadata: Metadata = {
  title: "Teenused",
  description:
    "Meie teenused — üldehitus, vundamendist katuseni terviklahendusena. Üks meeskond, üks vastutaja, üks ajakava. Ettemaksuta.",
  alternates: { canonical: "/teenused" },
};

// Page text comes from the database (see /admin/sisu), so it must not be
// prerendered at build time.
export const dynamic = "force-dynamic";

export default async function TeenusedPage() {
  const c = await getContent();

  return (
    <>
      <PageHero
        eyebrow="Üldehitus"
        heading={<RichText value={c("teenused.heading")} />}
        description={c("teenused.text")}
        tags={parseList(c("teenused.tags")).map((t) => ({ label: t.title, emphasis: t.emphasis }))}
      />

      <section className="relative h-130 overflow-hidden rounded-panel bg-ink">
        <Image
          src={c("teenused.image")}
          alt="Plokkseintega eramu ehitusjärgus, sarikad paigaldamisel"
          fill
          sizes="100vw"
          className="object-cover object-[center_bottom]"
        />
      </section>

      {SERVICES_DETAIL.map((service) => (
        <ServiceDetailRow key={service.number} service={service} />
      ))}

      <ProcessSection />

      <CtaBand
        heading={<RichText value={c("cta.teenused.heading")} />}
        secondaryLabel="Vaata projekte"
        secondaryHref="/projektid"
      />
    </>
  );
}
