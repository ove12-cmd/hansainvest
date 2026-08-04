import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { StatStack } from "@/components/sections/StatStack";
import { HERO_STATS } from "@/lib/data/home";

export function Hero() {
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
        <div className="max-w-90 shrink-0">
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

      <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="group relative h-110 overflow-hidden rounded-panel bg-ink">
          <Image
            src="/images/hero.png"
            alt="Hansaluxi meeskond siseviimistlust tegemas"
            fill
            priority
            sizes="(min-width: 1024px) 70vw, 100vw"
            className="object-cover object-[center_bottom] transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <Link
            href="/projektid/pooningu-valjaehitus"
            className="group/card absolute bottom-5 left-5 flex items-center gap-4.5 rounded-pill bg-white/94 p-2.5 pl-5 backdrop-blur-md transition-shadow duration-[450ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.16)]"
          >
            <span>
              <span className="block text-[14.5px] font-bold text-ink">Pööningu väljaehitus</span>
              <span className="block text-xs font-medium text-muted-2">Jõõpre · valmis 2025</span>
            </span>
            <span className="flex h-8.5 w-8.5 items-center justify-center rounded-full bg-ink text-sm text-white transition-transform duration-300 group-hover/card:translate-x-0.5">
              →
            </span>
          </Link>
        </div>

        <StatStack stats={HERO_STATS} />
      </div>
    </section>
  );
}
