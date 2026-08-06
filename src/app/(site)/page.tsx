import { Hero } from "@/components/home/Hero";
import { AboutSection } from "@/components/home/AboutSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { ContactSection } from "@/components/home/ContactSection";
import { CONTACT, SITE_URL } from "@/lib/constants";
import { getLatestProjects, getCategories } from "@/lib/projects";

// Data is cached at the query layer (see lib/projects.ts); this stays dynamic
// so the page never depends on database access at build time.
export const dynamic = "force-dynamic";

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: "Hansalux OÜ",
  url: SITE_URL,
  telephone: CONTACT.phone,
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Tallinna mnt 15/1-1",
    addressLocality: "Pärnu",
    addressCountry: "EE",
  },
  areaServed: "EE",
  sameAs: [CONTACT.facebook],
};

export default async function Home() {
  const [projects, categories] = await Promise.all([getLatestProjects(), getCategories()]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
      <Hero />
      <AboutSection />
      <ProcessSection />
      <ServicesSection />
      <ProjectsSection projects={projects} categories={categories} />
      <ContactSection />
    </>
  );
}
