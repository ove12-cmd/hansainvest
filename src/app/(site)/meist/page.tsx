import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { RichText } from "@/components/ui/RichText";
import { getContent } from "@/lib/content";
import { parseList } from "@/lib/data/editable";

export const metadata: Metadata = {
  title: "Meist",
  description:
    "Hansalux OÜ on Pärnus tegutsev ehitusettevõte. Noor ettevõte, kogenud meeskond — vundamendist viimistluseni, ilma ettemaksuta.",
  alternates: { canonical: "/meist" },
};

// Page text comes from the database (see /admin/sisu), so it must not be
// prerendered at build time.
export const dynamic = "force-dynamic";

export default async function MeistPage() {
  const c = await getContent();
  const principles = parseList(c("meist.principles"));

  return (
    <>
      <PageHero
        eyebrow="Meist"
        heading={<RichText value={c("meist.heading")} />}
        description={c("meist.text")}
        tags={parseList(c("about.tags")).map((t) => ({ label: t.title, emphasis: t.emphasis }))}
      />

      <section className="relative aspect-square overflow-hidden rounded-panel bg-ink sm:aspect-auto sm:h-105">
        <Image
          src={c("meist.image.mobile")}
          alt="Ehitaja krohvib seina"
          fill
          sizes="100vw"
          className="object-cover object-[center_bottom] sm:hidden"
        />
        <Image
          src={c("meist.image.desktop")}
          alt="Ehitaja krohvib seina"
          fill
          sizes="100vw"
          className="hidden object-cover object-[center_bottom] sm:block"
        />
      </section>

      <section aria-labelledby="pohimotted-heading" className="rounded-panel bg-white p-8 sm:p-12">
        <Badge className="mb-4.5">{c("meist.principles.badge")}</Badge>
        <Heading level={2} variant="sectionLg" id="pohimotted-heading" className="mb-9">
          <RichText value={c("meist.principles.heading")} />
        </Heading>
        <ol className="grid grid-cols-1 gap-x-14 lg:grid-cols-2">
          {principles.map((principle, i) => (
            <li
              key={principle.title}
              className={`flex gap-6.5 py-6 ${i < principles.length - 1 ? "border-b border-border-soft" : ""} ${
                i === principles.length - 2 ? "lg:border-b-0" : ""
              }`}
            >
              <span className="min-w-5.5 font-display text-sm font-bold text-brand">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="mb-1.5 block text-lg font-bold">{principle.title}</span>
                {principle.note && (
                  <Text variant="body" className="text-[14.5px]">
                    {principle.note}
                  </Text>
                )}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <CtaBand
        heading={<RichText value={c("cta.meist.heading")} />}
        secondaryLabel="Vaata projekte"
        secondaryHref="/projektid"
      />
    </>
  );
}
