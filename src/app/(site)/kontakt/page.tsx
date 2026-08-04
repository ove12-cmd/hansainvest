import type { Metadata } from "next";
import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { ContactForm } from "@/components/contact/ContactForm";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Helista, kirjuta või täida vorm. Hansalux tuleb objekti üle vaatama ja teeb ausa pakkumise — ettemaksu ei küsi.",
  alternates: { canonical: "/kontakt" },
};

const INFO_ITEMS = [
  { label: "Telefon", value: CONTACT.phone, href: CONTACT.phoneHref, big: true },
  { label: "E-post", value: CONTACT.email, href: CONTACT.emailHref, big: true },
  { label: "Aadress", value: "Tallinna mnt 15/1-1\n80036 Pärnu" },
  { label: "Tööajad", value: "E–R 8:00–18:00\nL kokkuleppel" },
];

export default function KontaktPage() {
  return (
    <>
      <section
        id="vorm"
        className="grid grid-cols-1 gap-3.5 lg:grid-cols-[minmax(0,1fr)_460px]"
      >
        <div className="flex flex-col justify-between gap-10 rounded-panel bg-white p-8 sm:p-14">
          <div>
            <Badge className="mb-5.5">Kontakt</Badge>
            <Heading level={1} variant="sectionXl" className="mb-5 max-w-[18ch]">
              Räägime sinu projektist
            </Heading>
            <Text variant="bodyLg" className="mb-8 max-w-[52ch]">
              Helista, kirjuta või täida vorm. Tuleme objekti üle vaatama, teeme ausa pakkumise — ja ettemaksu me ei
              küsi.
            </Text>
            <ul className="flex flex-wrap gap-2">
              <li className="rounded-pill bg-panel px-5 py-2.5 text-sm font-semibold">Tasuta ülevaatus</li>
              <li className="rounded-pill bg-panel px-5 py-2.5 text-sm font-semibold">
                Vastame 1 tööpäeva jooksul
              </li>
              <li className="rounded-pill bg-brand-tint px-5 py-2.5 text-sm font-bold text-brand">Ettemaksuta</li>
            </ul>
          </div>
          <ul className="grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {INFO_ITEMS.map((item) => (
              <li key={item.label} className="border-t border-border-soft py-5">
                <div className="mb-2 text-[11.5px] font-bold uppercase tracking-wide text-muted-3">{item.label}</div>
                {item.href ? (
                  <a
                    href={item.href}
                    className={`font-display font-bold tracking-tight ${item.big ? "text-xl" : "text-base"} break-all`}
                  >
                    {item.value}
                  </a>
                ) : (
                  <div className="whitespace-pre-line text-[15.5px] font-semibold leading-snug">{item.value}</div>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex rounded-panel bg-brand p-3.5">
          <ContactForm />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3.5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="relative h-85 overflow-hidden rounded-panel bg-[#E6E6E4]">
          <iframe
            src={CONTACT.mapsEmbedUrl}
            title={`Kaart — ${CONTACT.address}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
          <a
            href={CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute left-4 top-4 rounded-pill bg-white/94 px-4 py-2.5 text-[13px] font-bold text-ink backdrop-blur-md transition-colors hover:bg-white"
          >
            Ava Google Mapsis ↗
          </a>
        </div>
        <div className="flex flex-col justify-center rounded-panel bg-ink p-9 text-white">
          <div className="mb-6 text-xs font-bold uppercase tracking-wide text-accent-dark">Rekvisiidid</div>
          <dl>
            {[
              ["Ettevõte", "Hansalux OÜ"],
              ["Registrikood", "16812797"],
              ["Asukoht", "Tallinna mnt 15/1-1, Pärnu"],
              ["Piirkond", "Pärnumaa ja üle Eesti"],
            ].map(([label, value], i, arr) => (
              <div
                key={label}
                className={`flex items-baseline justify-between gap-4 py-3.5 ${
                  i < arr.length - 1 ? "border-b border-white/[0.12]" : ""
                }`}
              >
                <dt className="text-sm font-semibold text-footer-copy">{label}</dt>
                <dd className="text-right text-[15px] font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
