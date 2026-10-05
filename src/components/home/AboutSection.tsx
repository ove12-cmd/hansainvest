import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { RichText } from "@/components/ui/RichText";
import { getContent } from "@/lib/content";
import { parseList } from "@/lib/data/editable";

export async function AboutSection() {
  const c = await getContent();
  const tags = parseList(c("about.tags"));

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
          <RichText value={c("home.about.heading")} />
        </Heading>
        <Text variant="bodyLg" className="mb-8.5 max-w-[62ch]">
          {c("home.about.text")}
        </Text>
        <ul className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <li
              key={tag.title}
              className={`rounded-pill px-5 py-2.5 text-sm font-semibold ${
                tag.emphasis ? "bg-brand-tint text-brand font-bold" : "bg-panel"
              }`}
            >
              {tag.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
