import { ReactNode } from "react";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";

type PageHeroTag = { label: string; emphasis?: boolean };

type PageHeroProps = {
  eyebrow: string;
  heading: ReactNode;
  description: ReactNode;
  tags?: PageHeroTag[];
};

export function PageHero({ eyebrow, heading, description, tags }: PageHeroProps) {
  return (
    <section
      aria-labelledby="page-heading"
      className="grid grid-cols-1 gap-8 rounded-panel bg-white p-8 sm:p-12 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14"
    >
      <Text variant="eyebrow" as="div">
        {eyebrow}
      </Text>
      <div>
        <Heading level={1} variant="sectionXl" id="page-heading" className="mb-6 max-w-[22ch]">
          {heading}
        </Heading>
        <Text variant="bodyLg" className="max-w-[62ch]">
          {description}
        </Text>
        {tags && tags.length > 0 && (
          <ul className="mt-8.5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <li
                key={tag.label}
                className={`rounded-pill px-5 py-2.5 text-sm font-semibold ${
                  tag.emphasis ? "bg-brand-tint font-bold text-brand" : "bg-panel"
                }`}
              >
                {tag.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
