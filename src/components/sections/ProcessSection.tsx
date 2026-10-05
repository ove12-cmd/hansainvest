import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { RichText } from "@/components/ui/RichText";
import { getContent } from "@/lib/content";
import { parseList } from "@/lib/data/editable";

export async function ProcessSection() {
  const c = await getContent();
  const steps = parseList(c("process.steps"));

  return (
    <section aria-labelledby="protsess-heading" className="rounded-panel bg-white p-8 sm:p-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-8">
        <div>
          <Badge className="mb-4.5">{c("process.badge")}</Badge>
          <Heading level={2} variant="sectionLg" id="protsess-heading">
            <RichText value={c("process.heading")} />
          </Heading>
        </div>
        <Text variant="body" className="max-w-[34ch]">
          {c("process.text")}
        </Text>
      </div>
      <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title}>
            <div className="mb-4 font-display text-3xl font-bold tracking-tight text-brand">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="mb-2 text-lg font-bold">{step.title}</div>
            {step.note && (
              <Text variant="body" className="text-[14.5px] text-muted-2">
                {step.note}
              </Text>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
