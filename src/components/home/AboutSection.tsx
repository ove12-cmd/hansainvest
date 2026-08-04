import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ABOUT_TAGS } from "@/lib/data/home";

export function AboutSection() {
  return (
    <section
      id="meist"
      aria-labelledby="meist-heading"
      className="grid grid-cols-1 gap-8 rounded-panel bg-white p-8 sm:p-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14"
    >
      <Text variant="eyebrow" as="div">
        Meist
      </Text>
      <div>
        <Heading level={2} variant="section" id="meist-heading" className="mb-6 max-w-[28ch]">
          Noor ettevõte, kogenud meeskond — ja põhimõtted, mis ei muutu.
        </Heading>
        <Text variant="bodyLg" className="mb-8.5 max-w-[62ch]">
          Hansalux on noor ettevõte, aga meie meeskond on aastate jooksul ellu viinud ka kõige keerukamad
          ehitusprojektid. Töötame Pärnus ja üle Eesti — nii eramute kui ärihoonetega.
        </Text>
        <ul className="flex flex-wrap gap-2">
          {ABOUT_TAGS.map((tag) => (
            <li
              key={tag.label}
              className={`rounded-pill px-5 py-2.5 text-sm font-semibold ${
                tag.emphasis ? "bg-brand-tint text-brand font-bold" : "bg-panel"
              }`}
            >
              {tag.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
