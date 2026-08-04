import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { ServiceDetailRow } from "@/components/sections/ServiceDetailRow";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { SERVICES_DETAIL } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Üldehitus",
  description:
    "Üldehitustööd terviklahendusena — vundamendist katuseni. Üks meeskond, üks vastutaja, üks ajakava. Ettemaksuta.",
  alternates: { canonical: "/uldehitus" },
};

const HERO_TAGS = [
  { label: "Eramud" },
  { label: "Ärihooned" },
  { label: "Renoveerimine" },
  { label: "Juurdeehitus" },
  { label: "Ettemaksuta", emphasis: true },
];

export default function UldehitusPage() {
  return (
    <>
      <PageHero
        eyebrow="Üldehitus"
        heading="Täisteenus algusest lõpuni"
        description="Teostame üldehitustöid terviklahendusena — vundamendist kuni viimistluseni. Sa ei pea otsima eraldi meest iga etapi jaoks: üks meeskond, üks vastutaja, üks ajakava."
        tags={HERO_TAGS}
      />

      <section className="relative h-130 overflow-hidden rounded-panel bg-ink">
        <Image
          src="/images/uldehitus.png"
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
        heading="Räägi, mida plaanid ehitada"
        secondaryLabel="Vaata projekte"
        secondaryHref="/projektid"
      />
    </>
  );
}
