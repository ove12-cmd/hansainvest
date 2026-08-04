import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ContactForm } from "@/components/home/ContactForm";
import { CONTACT } from "@/lib/constants";

export function ContactSection() {
  return (
    <section
      id="kontakt"
      aria-labelledby="kontakt-heading"
      className="grid grid-cols-1 items-center gap-10 rounded-panel bg-brand p-8 text-white sm:p-14 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-14"
    >
      <div>
        <Badge variant="onBrand" className="mb-5.5">
          Teeme koostööd
        </Badge>
        <Heading level={2} variant="sectionXl" id="kontakt-heading" className="mb-4.5">
          Alustame sinu projekti
        </Heading>
        <Text variant="bodyLg" className="mb-7 max-w-[42ch] text-white/90">
          Jäta kontakt — vaatame objekti üle ja teeme ausa pakkumise. Ettemaksu ei küsi.
        </Text>
        <div className="flex flex-wrap gap-2">
          <a
            href={CONTACT.phoneHref}
            className="rounded-pill bg-white/[0.16] px-5 py-2.5 text-[14.5px] font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-brand"
          >
            {CONTACT.phone}
          </a>
          <a
            href={CONTACT.emailHref}
            className="rounded-pill bg-white/[0.16] px-5 py-2.5 text-[14.5px] font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-brand"
          >
            {CONTACT.email}
          </a>
          <span className="rounded-pill bg-white/[0.16] px-5 py-2.5 text-[14.5px] font-semibold">
            {CONTACT.address}
          </span>
        </div>
      </div>

      <ContactForm />
    </section>
  );
}
