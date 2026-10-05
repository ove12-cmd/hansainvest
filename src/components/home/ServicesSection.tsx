import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { RichText } from "@/components/ui/RichText";
import { SERVICE_LINES, SERVICE_TAGS } from "@/lib/data/home";
import { getContent } from "@/lib/content";

export async function ServicesSection() {
  const c = await getContent();

  return (
    <section
      id="teenused"
      aria-labelledby="teenused-heading"
      className="grid grid-cols-1 gap-3.5 lg:grid-cols-2"
    >
      <div className="rounded-panel bg-white p-8 sm:p-12">
        <Badge className="mb-5">{c("home.services.badge")}</Badge>
        <Heading level={2} variant="panel" className="mb-5" id="teenused-heading">
          <RichText value={c("home.services.heading")} />
        </Heading>
        <ul className="mb-6 flex flex-wrap gap-2">
          {SERVICE_TAGS.map((tag) => (
            <li key={tag} className="rounded-pill bg-panel px-4 py-2.5 text-[13px] font-semibold">
              {tag}
            </li>
          ))}
        </ul>
        <ol>
          {SERVICE_LINES.map((line, i) => (
            <li
              key={line.number}
              className={i < SERVICE_LINES.length - 1 ? "border-b border-border-soft" : ""}
            >
              <Link
                href="/kontakt"
                className="flex items-baseline gap-5.5 rounded-lg px-2 py-4 -mx-2 transition-colors duration-200 hover:bg-panel"
              >
                <span className="min-w-5 font-display text-xs font-bold text-brand">{line.number}</span>
                <span className="flex-1 text-lg font-bold">{line.title}</span>
                {line.note && <span className="text-[13.5px] font-medium text-muted-3">{line.note}</span>}
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col gap-3.5">
        <div className="group relative min-h-60 flex-1 overflow-hidden rounded-panel bg-ink">
          <Image
            src={c("home.services.image")}
            alt="Täisteenus algusest lõpuni — Hansaluxi meeskond tööl"
            fill
            sizes="(min-width: 1024px) 35vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </div>
        <div className="rounded-panel bg-ink p-9 text-white">
          <Badge variant="onDark" className="mb-5">
            Meie lubadus
          </Badge>
          <blockquote className="mb-5 font-display text-quote font-medium">
            {c("home.promise.quote")}
          </blockquote>
          <Text variant="quoteBody">{c("home.promise.text")}</Text>
        </div>
      </div>
    </section>
  );
}
