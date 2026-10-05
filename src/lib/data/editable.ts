// Every piece of page text/imagery the admin can edit at /admin/sisu.
// `default` is what the site shows until someone saves a value, so this file
// stays the real source of truth and nothing needs seeding into the database.
//
// In `heading` fields a newline becomes a line break and *stars* mark the
// brand-coloured words (see RichText).

export type EditableFieldType = "text" | "heading" | "textarea" | "image" | "list";

export type ListItem = { title: string; note?: string; emphasis?: boolean };

// A "list" field is one item per line. `|` splits the item's title from its
// note/description, and *stars* around the whole line mark it as emphasised
// (the brand-coloured pill). Deleting a line deletes the item; the 01/02
// numbering some lists show is positional, so it renumbers itself.
export function parseList(value: string): ListItem[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const emphasis = line.startsWith("*") && line.endsWith("*") && line.length > 1;
      const body = emphasis ? line.slice(1, -1).trim() : line;
      const [title, ...rest] = body.split("|");
      const note = rest.join("|").trim();
      return { title: title.trim(), note: note || undefined, emphasis: emphasis || undefined };
    });
}

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
        key: "home.services.tags",
        label: "Sildid (üks rea kohta)",
        type: "list",
        default: "Eramud\nÄrihooned\nRenoveerimine\nJuurdeehitus",
      },
      {
        key: "home.services.lines",
        label: "Tööde nimekiri (üks rea kohta, | järel täpsustus)",
        type: "list",
        default: [
          "Vundamendid ja soojustus",
          "Seinte ladumine | Fibo, plokk, tellis, Bauroc",
          "Laed ja vahelaed",
          "Katused ja sarikad",
          "Soojustus ja tuuletõkked",
          "Fassaadid | krohv, laudis, värvimine",
        ].join("\n"),
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
    title: "Kuidas töötame (esileht + teenused)",
    fields: [
      { key: "process.badge", label: "Silt", type: "text", default: "Kuidas töötame" },
      {
        key: "process.heading",
        label: "Pealkiri",
        type: "heading",
        default: "Neli sammu valmis objektini",
      },
      {
        key: "process.text",
        label: "Tekst",
        type: "textarea",
        default: "Selge protsess, selge hind — ilma üllatusteta.",
      },
      {
        key: "process.steps",
        label: "Sammud (üks rea kohta, | järel selgitus)",
        type: "list",
        default: [
          "Ülevaatus | Tuleme kohale, vaatame objekti üle ja kuulame sinu soovid.",
          "Aus pakkumine | Selge hind ja ajakava — ilma peidetud ridadeta.",
          "Ehitus | Üks meeskond objektil, sina saad regulaarselt ülevaate.",
          "Üleandmine | Vaatame töö koos üle ja alles siis tasud tehtud töö eest.",
        ].join("\n"),
      },
    ],
  },
  {
    title: "Esileht — projektid",
    fields: [
      { key: "home.projects.badge", label: "Silt", type: "text", default: "Projektid" },
      {
        key: "home.projects.heading",
        label: "Pealkiri",
        type: "heading",
        default: "Viimati valminud tööd",
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
      {
        key: "about.tags",
        label: "Sildid — esilehel ja Meist lehel (*tärnide vahel* = punane)",
        type: "list",
        default: [
          "Ei mingit ettemaksu",
          "Lahendame, ei peida",
          "Kodumaa tööjõud",
          "Üks vastutav partner",
          "*Kvaliteedigarantii*",
        ].join("\n"),
      },
      { key: "meist.principles.badge", label: "Põhimõtete silt", type: "text", default: "Põhimõtted" },
      {
        key: "meist.principles.heading",
        label: "Põhimõtete pealkiri",
        type: "heading",
        default: "Millel meie töö põhineb",
      },
      {
        key: "meist.principles",
        label: "Põhimõtted (üks rea kohta, | järel selgitus)",
        type: "list",
        default: [
          "Ei mingit ettemaksu | Maksad tehtud töö eest, mitte lubaduste eest.",
          "Lahendame, ei peida | Probleemide tekkimisel leiame lahenduse, mitte vabanduse.",
          "Kodumaa tööjõud | Eelistame Eesti mehi — kvaliteet ja vastutus on kohapeal.",
          "Üks vastutav partner | Kogu objekt ühe meeskonna käes, algusest lõpuni.",
        ].join("\n"),
      },
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
      {
        key: "teenused.tags",
        label: "Sildid (*tärnide vahel* = punane)",
        type: "list",
        default: ["Eramud", "Ärihooned", "Renoveerimine", "Juurdeehitus", "*Ettemaksuta*"].join("\n"),
      },
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
      {
        key: "kontakt.tags",
        label: "Sildid (*tärnide vahel* = punane)",
        type: "list",
        default: ["Tasuta ülevaatus", "Vastame 1 tööpäeva jooksul", "*Ettemaksuta*"].join("\n"),
      },
    ],
  },
  {
    title: "Kutse-plokk (lehtede lõpus)",
    fields: [
      { key: "cta.badge", label: "Silt", type: "text", default: "Teeme koostööd" },
      {
        key: "cta.text",
        label: "Tekst",
        type: "textarea",
        default: "Vaatame objekti üle ja teeme ausa pakkumise. Ettemaksu ei küsi.",
      },
      { key: "cta.meist.heading", label: "Pealkiri — Meist", type: "heading", default: "Alustame sinu projekti" },
      {
        key: "cta.projektid.heading",
        label: "Pealkiri — Projektid",
        type: "heading",
        default: "Sinu objekt võiks olla järgmine",
      },
      {
        key: "cta.teenused.heading",
        label: "Pealkiri — Teenused",
        type: "heading",
        default: "Räägi, mida plaanid ehitada",
      },
    ],
  },
];

export const EDITABLE_FIELDS = EDITABLE_SECTIONS.flatMap((s) => s.fields);

export const CONTENT_DEFAULTS: Record<string, string> = Object.fromEntries(
  EDITABLE_FIELDS.map((f) => [f.key, f.default])
);
