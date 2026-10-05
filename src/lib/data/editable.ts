// Every piece of page text/imagery the admin can edit at /admin/sisu.
// `default` is what the site shows until someone saves a value, so this file
// stays the real source of truth and nothing needs seeding into the database.
//
// In `heading` fields a newline becomes a line break and *stars* mark the
// brand-coloured words (see RichText).

export type EditableFieldType = "text" | "heading" | "textarea" | "image";

export type EditableField = {
  key: string;
  label: string;
  type: EditableFieldType;
  default: string;
};

export type EditableSection = {
  title: string;
  fields: EditableField[];
};

export const EDITABLE_SECTIONS: EditableSection[] = [
  {
    title: "Esileht — päis",
    fields: [
      {
        key: "home.hero.badge",
        label: "Silt",
        type: "text",
        default: "Ehitus & remont — Pärnu ja üle Eesti",
      },
      {
        key: "home.hero.heading",
        label: "Pealkiri",
        type: "heading",
        default: "Suur või väike —\nkvaliteet *garanteeritud*",
      },
      {
        key: "home.hero.text",
        label: "Tekst",
        type: "textarea",
        default:
          "Vundamendist viimistluseni. Üks meeskond, selge vastutus. Me ei küsi raha ette — maksad tehtud töö eest.",
      },
    ],
  },
  {
    title: "Esileht — meist",
    fields: [
      {
        key: "home.about.heading",
        label: "Pealkiri",
        type: "heading",
        default: "Noor ettevõte, kogenud meeskond — ja põhimõtted, mis ei muutu.",
      },
      {
        key: "home.about.text",
        label: "Tekst",
        type: "textarea",
        default:
          "Hansalux on noor ettevõte, aga meie meeskond on aastate jooksul ellu viinud ka kõige keerukamad ehitusprojektid. Töötame Pärnus ja üle Eesti — nii eramute kui ärihoonetega.",
      },
    ],
  },
  {
    title: "Esileht — teenused",
    fields: [
      { key: "home.services.badge", label: "Silt", type: "text", default: "Üldehitustööd" },
      {
        key: "home.services.heading",
        label: "Pealkiri",
        type: "heading",
        default: "Täisteenus algusest lõpuni",
      },
      {
        key: "home.services.image",
        label: "Pilt",
        type: "image",
        default: "/images/uldehitus-teaser.png",
      },
      {
        key: "home.promise.quote",
        label: "Lubaduse tsitaat",
        type: "textarea",
        default: "„Me ei küsi raha ette. Sa maksad tehtud töö eest.”",
      },
      {
        key: "home.promise.text",
        label: "Lubaduse tekst",
        type: "textarea",
        default:
          "Probleemide tekkimisel ei poe me peitu, vaid leiame lahenduse. Eelistame kodumaa tööjõudu.",
      },
    ],
  },
  {
    title: "Esileht — kontaktiplokk",
    fields: [
      { key: "home.contact.badge", label: "Silt", type: "text", default: "Teeme koostööd" },
      {
        key: "home.contact.heading",
        label: "Pealkiri",
        type: "heading",
        default: "Alustame sinu projekti",
      },
      {
        key: "home.contact.text",
        label: "Tekst",
        type: "textarea",
        default: "Jäta kontakt — vaatame objekti üle ja teeme ausa pakkumise. Ettemaksu ei küsi.",
      },
    ],
  },
  {
    title: "Meist",
    fields: [
      {
        key: "meist.heading",
        label: "Pealkiri",
        type: "heading",
        default: "Noor ettevõte, kogenud meeskond",
      },
      {
        key: "meist.text",
        label: "Tekst",
        type: "textarea",
        default:
          "Hansalux OÜ on Pärnus tegutsev ehitusettevõte. Oleme noored, aga meie mehed on aastate jooksul ellu viinud ka kõige keerukamad ehitusprojektid — eramutest ärihooneteni. Töötame üle Eesti ja võtame vastutuse kogu objekti eest.",
      },
      { key: "meist.image.mobile", label: "Pilt (mobiil)", type: "image", default: "/images/meist-mobile.webp" },
      { key: "meist.image.desktop", label: "Pilt (arvuti)", type: "image", default: "/images/meist-desktop.webp" },
    ],
  },
  {
    title: "Teenused",
    fields: [
      {
        key: "teenused.heading",
        label: "Pealkiri",
        type: "heading",
        default: "Täisteenus algusest lõpuni",
      },
      {
        key: "teenused.text",
        label: "Tekst",
        type: "textarea",
        default:
          "Teostame üldehitustöid terviklahendusena — vundamendist kuni viimistluseni. Sa ei pea otsima eraldi meest iga etapi jaoks: üks meeskond, üks vastutaja, üks ajakava.",
      },
      { key: "teenused.image", label: "Suur pilt", type: "image", default: "/images/uldehitus.png" },
    ],
  },
  {
    title: "Projektid",
    fields: [
      {
        key: "projektid.heading",
        label: "Pealkiri",
        type: "heading",
        default: "Valminud tööd üle Eesti",
      },
      {
        key: "projektid.text",
        label: "Tekst",
        type: "textarea",
        default:
          "Eramud, korterid, ärihooned ja kõrvalhooned — vundamendist võtmete üleandmiseni. Iga objekt on tehtud sama meeskonna ja sama standardiga.",
      },
    ],
  },
  {
    title: "Kontakt",
    fields: [
      {
        key: "kontakt.heading",
        label: "Pealkiri",
        type: "heading",
        default: "Räägime sinu projektist",
      },
      {
        key: "kontakt.text",
        label: "Tekst",
        type: "textarea",
        default:
          "Helista, kirjuta või täida vorm. Tuleme objekti üle vaatama, teeme ausa pakkumise — ja ettemaksu me ei küsi.",
      },
    ],
  },
];

export const EDITABLE_FIELDS = EDITABLE_SECTIONS.flatMap((s) => s.fields);

export const CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  EDITABLE_FIELDS.map((f) => [f.key, f.default])
);
