import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { BeforeAfterSlider } from "@/components/projects/BeforeAfterSlider";
import { GalleryLightbox } from "@/components/projects/GalleryLightbox";
import { getProjectBySlug, getRelatedProjects } from "@/lib/projects";

type Params = { params: Promise<{ slug: string }> };

// Data is cached at the query layer (see lib/projects.ts); this stays dynamic
// so the page never depends on database access at build time.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Projekt" };

  return {
    title: project.title,
    description: project.summary ?? `${project.title} — ${project.location}. Hansaluxi valminud ehitusprojekt.`,
    alternates: { canonical: `/projektid/${project.slug}` },
  };
}

export default async function ProjektDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const related = await getRelatedProjects(slug, 3);
  const heroImages = [project.image1Url, project.image2Url].filter((url): url is string => Boolean(url));
  const galleryImages = project.gallery;
  const hasBeforeAfter = Boolean(project.beforeImageUrl && project.afterImageUrl);

  const metaPills = [
    project.location,
    project.completedYear ? `Valmis ${project.completedYear}` : null,
    project.propertyType,
    project.area,
    project.duration,
  ].filter((v): v is string => Boolean(v));

  return (
    <>
      <section className="rounded-panel bg-white p-8 pb-10 sm:p-12">
        <Link
          href="/projektid"
          className="group mb-7 inline-flex items-center gap-2 rounded-pill bg-panel px-4 py-2.5 text-[13px] font-semibold transition-colors duration-200 hover:bg-border-soft"
        >
          <span className="flex items-center transition-transform duration-300 group-hover:-translate-x-0.5">
            <ArrowIcon direction="left" className="h-2.5 w-2.5" />
          </span>
          Kõik projektid
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-12">
          <div>
            <h1 className="mb-5 max-w-[20ch] font-display text-[clamp(34px,4vw,54px)] font-semibold leading-[1.05] tracking-tight text-balance">
              {project.title}
            </h1>
            <ul className="flex flex-wrap gap-2">
              {metaPills.map((pill, i) => (
                <li
                  key={pill}
                  className={`rounded-pill px-4.5 py-2.5 text-[13.5px] font-semibold ${
                    i === 0 ? "bg-brand-tint font-bold text-brand" : "bg-panel"
                  }`}
                >
                  {pill}
                </li>
              ))}
            </ul>
          </div>
          {project.summary && (
            <Text variant="bodyLg" className="max-w-[42ch]">
              {project.summary}
            </Text>
          )}
        </div>
      </section>

      {heroImages.length > 0 && (
        <section className={`grid grid-cols-1 gap-3.5 ${heroImages.length > 1 ? "lg:grid-cols-2" : ""}`}>
          {heroImages.map((url, i) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-panel bg-ink lg:aspect-auto lg:h-130">
              <Image
                src={url}
                alt={i === 0 ? `Peapilt — ${project.title}` : `Teine pilt — ${project.title}`}
                fill
                priority={i === 0}
                sizes={heroImages.length > 1 ? "(min-width: 1024px) 50vw, 100vw" : "100vw"}
                className="object-cover object-[center_bottom]"
              />
            </div>
          ))}
        </section>
      )}

      {hasBeforeAfter && (
        <section className="rounded-panel bg-white p-8 sm:p-12">
          <BeforeAfterSlider beforeImageUrl={project.beforeImageUrl!} afterImageUrl={project.afterImageUrl!} />
        </section>
      )}

      {(project.description || project.works.length > 0) && (
        <section
          className={`grid grid-cols-1 gap-3.5 ${
            project.description && project.works.length > 0 ? "lg:grid-cols-[minmax(0,1fr)_360px]" : ""
          }`}
        >
          {project.description && (
            <div className="rounded-panel bg-white p-8 sm:p-12">
              <Badge className="mb-5.5">Ülevaade</Badge>
              <div className="flex flex-col gap-4.5">
                {project.description.split("\n\n").map((paragraph, i) => (
                  <Text key={i} variant="bodyLg" className="max-w-[60ch]">
                    {paragraph}
                  </Text>
                ))}
              </div>
            </div>
          )}
          {project.works.length > 0 && (
            <div className="flex flex-col justify-between gap-8 rounded-panel bg-ink p-9 text-white">
              <div>
                <div className="mb-6 text-xs font-bold uppercase tracking-wide text-accent-dark">Tehtud tööd</div>
                <ol>
                  {project.works.map((work, i) => (
                    <li
                      key={work}
                      className={`flex items-baseline gap-4 py-3 ${
                        i < project.works.length - 1 ? "border-b border-white/[0.12]" : ""
                      }`}
                    >
                      <span className="font-display text-xs font-bold text-accent-dark">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[15.5px] font-semibold">{work}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <Button href="/kontakt" variant="brand" size="sm" className="self-start">
                Küsi sarnast pakkumist
              </Button>
            </div>
          )}
        </section>
      )}

      {galleryImages.length > 0 && (
        <section className="rounded-panel bg-white p-8 sm:p-12">
          <GalleryLightbox images={galleryImages} title={project.title} />
        </section>
      )}

      {related.length > 0 && (
        <section aria-labelledby="jargmised-heading" className="rounded-panel bg-white p-8 sm:p-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-8">
            <div>
              <Badge className="mb-4.5">Järgmised projektid</Badge>
              <h2 id="jargmised-heading" className="font-display text-[28px] font-semibold leading-[1.1] tracking-tight sm:text-4xl">
                Vaata ka neid töid
              </h2>
            </div>
            <Link href="/projektid" className="inline-flex items-center gap-1.5 text-[14.5px] font-semibold text-brand">
              Kõik projektid <ArrowIcon className="h-2.5 w-2.5" />
            </Link>
          </div>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((item) => (
              <li key={item.id}>
                <Link href={`/projektid/${item.slug}`} className="group flex flex-col gap-3.5">
                  <span className="relative block aspect-4/3 overflow-hidden rounded-xl bg-panel">
                    {item.image1Url ? (
                      <Image
                        src={item.image1Url}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                      />
                    ) : (
                      <span className="flex h-full items-center justify-center px-4 text-center text-xs font-semibold text-muted-3">
                        {item.title}
                      </span>
                    )}
                  </span>
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[17px] font-bold text-ink">{item.title}</span>
                    <span className="whitespace-nowrap rounded-pill bg-panel px-3 py-1.5 text-xs font-semibold text-muted-2">
                      {item.location}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
