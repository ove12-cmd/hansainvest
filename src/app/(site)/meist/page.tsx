import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ABOUT_TAGS } from "@/lib/data/home";
import { PRINCIPLES } from "@/lib/data/meist";

export const metadata: Metadata = {
  title: "Meist",
  description:
    "Hansalux OÜ on Pärnus tegutsev ehitusettevõte. Noor ettevõte, kogenud meeskond — vundamendist viimistluseni, ilma ettemaksuta.",
  alternates: { canonical: "/meist" },
};

export default function MeistPage() {
  return (
    <>
      <PageHero
        eyebrow="Meist"
        heading="Noor ettevõte, kogenud meeskond"
        description="Hansalux OÜ on Pärnus tegutsev ehitusettevõte. Oleme noored, aga meie mehed on aastate jooksul ellu viinud ka kõige keerukamad ehitusprojektid — eramutest ärihooneteni. Töötame üle Eesti ja võtame vastutuse kogu objekti eest."
        tags={ABOUT_TAGS}
      />

      <section className="relative aspect-square overflow-hidden rounded-panel bg-ink sm:aspect-auto sm:h-105">
        <Image
          src="/images/meist-mobile.webp"
          alt="Ehitaja krohvib seina"
          fill
          sizes="100vw"
          className="object-cover object-[center_bottom] sm:hidden"
        />
        <Image
          src="/images/meist-desktop.webp"
          alt="Ehitaja krohvib seina"
          fill
          sizes="100vw"
          className="hidden object-cover object-[center_bottom] sm:block"
        />
      </section>

      <section aria-labelledby="pohimotted-heading" className="rounded-panel bg-white p-8 sm:p-12">
        <Badge className="mb-4.5">Põhimõtted</Badge>
        <Heading level={2} variant="sectionLg" id="pohimotted-heading" className="mb-9">
          Millel meie töö põhineb
        </Heading>
        <ol className="grid grid-cols-1 gap-x-14 lg:grid-cols-2">
          {PRINCIPLES.map((principle, i) => (
            <li
              key={principle.number}
              className={`flex gap-6.5 py-6 ${i < PRINCIPLES.length - 1 ? "border-b border-border-soft" : ""} ${
                i === PRINCIPLES.length - 2 ? "lg:border-b-0" : ""
              }`}
            >
              <span className="min-w-5.5 font-display text-sm font-bold text-brand">{principle.number}</span>
              <span>
                <span className="mb-1.5 block text-lg font-bold">{principle.title}</span>
                <Text variant="body" className="text-[14.5px]">
                  {principle.description}
                </Text>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand heading="Alustame sinu projekti" secondaryLabel="Vaata projekte" secondaryHref="/projektid" />
    </>
  );
}
