import { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { getContent } from "@/lib/content";

type CtaBandProps = {
  heading: ReactNode;
  description?: ReactNode;
  secondaryLabel: string;
  secondaryHref: string;
};

export async function CtaBand({ heading, description, secondaryLabel, secondaryHref }: CtaBandProps) {
  const c = await getContent();

  return (
    <section className="flex flex-wrap items-end justify-between gap-12 rounded-panel bg-brand p-8 text-white sm:p-14">
      <div>
        <Badge variant="onBrand" className="mb-5.5">
          {c("cta.badge")}
        </Badge>
        <Heading level={2} variant="sectionXl" className="mb-4">
          {heading}
        </Heading>
        <Text variant="bodyLg" className="max-w-[44ch] text-white/90">
          {description ?? c("cta.text")}
        </Text>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <Button href="/kontakt" variant="onBrand">
          Küsi pakkumist
        </Button>
        <Button href={secondaryHref} variant="outlineOnBrand">
          {secondaryLabel}
        </Button>
      </div>
    </section>
  );
}
