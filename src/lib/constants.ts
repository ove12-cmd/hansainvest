export const SITE_NAME = "Hansalux";
export const SITE_URL = "https://www.hansalux.ee";
export const SITE_DESCRIPTION =
  "Hansalux OÜ — üldehitus- ja remonditööd Pärnus ja üle Eesti. Vundamendist viimistluseni, ilma ettemaksuta.";

export const CONTACT = {
  phone: "+372 560 84909",
  phoneHref: "tel:+37256084909",
  email: "Hansalux.mike@gmail.com",
  emailHref: "mailto:Hansalux.mike@gmail.com",
  address: "Tallinna mnt 15/1-1, Pärnu",
  facebook: "https://www.facebook.com/HansaluxOU",
  mapsUrl: "https://maps.app.goo.gl/exDLGyvsnP7t8EGP9",
  mapsEmbedUrl: "https://www.google.com/maps?q=58.3908112,24.4958439&z=16&output=embed",
};

export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Esileht", href: "/" },
  { label: "Meist", href: "/meist" },
  { label: "Üldehitus", href: "/uldehitus" },
  { label: "Projektid", href: "/projektid" },
  { label: "Kontakt", href: "/kontakt" },
];
