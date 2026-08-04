import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { PROCESS_STEPS } from "@/lib/data/home";

export function ProcessSection() {
  return (
    <section aria-labelledby="protsess-heading" className="rounded-panel bg-white p-8 sm:p-12">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-8">
        <div>
          <Badge className="mb-4.5">Kuidas töötame</Badge>
          <Heading level={2} variant="sectionLg" id="protsess-heading">
            Neli sammu valmis objektini
          </Heading>
        </div>
        <Text variant="body" className="max-w-[34ch]">
          Selge protsess, selge hind — ilma üllatusteta.
        </Text>
      </div>
      <ol className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {PROCESS_STEPS.map((step) => (
          <li key={step.number}>
            <div className="mb-4 font-display text-3xl font-bold tracking-tight text-brand">{step.number}</div>
            <div className="mb-2 text-lg font-bold">{step.title}</div>
            <Text variant="body" className="text-[14.5px] text-muted-2">
              {step.description}
            </Text>
          </li>
        ))}
      </ol>
    </section>
  );
}
