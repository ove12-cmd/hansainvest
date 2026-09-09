import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { HeroSlider } from "@/components/home/HeroSlider";
import { getProjectBySlug } from "@/lib/projects";

const HERO_PROJECT_SLUG = "alexela-takupoiss-sisetood-ja-fassaad";

export async function Hero() {
  const project = await getProjectBySlug(HERO_PROJECT_SLUG);
  const images = project ? [project.image1Url, project.image2Url].filter((url): url is string => Boolean(url)) : [];

  return (
    <section id="top" aria-label="Hansalux — ehitus ja remont" className="flex flex-col gap-3.5">
      <div className="flex flex-wrap items-end justify-between gap-14 rounded-panel bg-white px-8 py-10 sm:px-12 sm:py-13">
        <div>
          <Badge className="mb-6.5">Ehitus &amp; remont — Pärnu ja üle Eesti</Badge>
          <Heading level={1} variant="hero">
            Suur või väike —<br />
            kvaliteet <span className="text-brand">garanteeritud</span>
          </Heading>
        </div>
        <div className="w-full sm:max-w-90 sm:shrink-0">
          <Text variant="bodyLg" className="mb-6.5">
            Vundamendist viimistluseni. Üks meeskond, selge vastutus. Me ei küsi raha ette — maksad tehtud töö
            eest.
          </Text>
          <div className="flex flex-wrap gap-2.5">
            <Button href="/kontakt" variant="solid">
              Küsi pakkumist
            </Button>
            <Button href="/projektid" variant="outline">
              Projektid
            </Button>
          </div>
        </div>
      </div>

      {images.length > 0 && project && (
        <div className="relative">
          <HeroSlider images={images} title={project.title} />

          <div className="hidden gap-3.5 sm:grid sm:h-110 sm:grid-cols-2">
            {images.map((src, i) => (
              <div key={src} className="group relative overflow-hidden rounded-panel bg-ink">
                <Image
                  src={src}
                  alt={`${project.title} — foto ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="50vw"
                  className="object-cover object-[center_bottom] transition-transform duration-700 ease-out group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          <Link
            href={`/projektid/${project.slug}`}
            className="group/card absolute bottom-5 left-5 z-10 flex items-center gap-4.5 rounded-pill bg-white/94 p-2.5 pl-5 backdrop-blur-md transition-shadow duration-[450ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.16)]"
          >
            <span>
              <span className="block text-[14.5px] font-bold text-ink">{project.title}</span>
              <span className="block text-xs font-medium text-muted-2">{project.location}</span>
            </span>
            <span className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-ink text-white transition-transform duration-300 group-hover/card:translate-x-0.5">
              <ArrowIcon className="h-3 w-3" />
            </span>
          </Link>
        </div>
      )}
    </section>
  );
}
