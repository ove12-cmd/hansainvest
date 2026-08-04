import { slugify } from "@/lib/slugify";
import { extractHtmlListItems } from "@/lib/richtext";

export const CSV_HEADERS = [
  "Nimi",
  "Slug",
  "Asukoht",
  "Kategooria",
  "Esimene pilt",
  "Teine pilt",
  "Tehtud tööd",
  "Pildid",
  "Pane esimeseks",
  "Sort",
] as const;

export type CsvProjectRow = {
  title: string;
  slug: string;
  location: string;
  category: string;
  image1Url: string;
  image2Url: string;
  works: string[];
  gallery: string[];
  featured: boolean;
  sort: number;
};

function parseCsvText(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          quoted = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      quoted = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") {
      field += c;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

export function parseProjectsCsv(text: string): { items: CsvProjectRow[]; error?: string } {
  const rows = parseCsvText(text);
  if (!rows.length) return { items: [], error: "CSV on tühi." };

  const head = rows[0].map((h) => h.trim().toLowerCase());
  const index: Record<string, number> = {};
  CSV_HEADERS.forEach((h) => {
    index[h] = head.indexOf(h.toLowerCase());
  });
  if (index["Nimi"] === -1) return { items: [], error: 'Päises puudub veerg „Nimi”.' };

  const get = (r: string[], key: (typeof CSV_HEADERS)[number]) =>
    index[key] > -1 ? (r[index[key]] || "").trim() : "";

  const items: CsvProjectRow[] = rows
    .slice(1)
    .map((r, i) => {
      const title = get(r, "Nimi");
      const worksRaw = get(r, "Tehtud tööd");
      const works =
        extractHtmlListItems(worksRaw) ??
        worksRaw
          .split(";")
          .map((v) => v.trim())
          .filter(Boolean);
      const gallery = get(r, "Pildid")
        .split(";")
        .map((v) => v.trim())
        .filter(Boolean);
      const feat = get(r, "Pane esimeseks").toLowerCase();
      const sortRaw = get(r, "Sort");
      return {
        title,
        slug: get(r, "Slug") || slugify(title),
        location: get(r, "Asukoht"),
        category: get(r, "Kategooria"),
        image1Url: get(r, "Esimene pilt"),
        image2Url: get(r, "Teine pilt"),
        works,
        gallery,
        featured: feat === "jah" || feat === "yes" || feat === "true" || feat === "1",
        sort: sortRaw === "" ? i + 1 : Number(sortRaw),
      };
    })
    .filter((row) => row.title);

  if (!items.length) return { items: [], error: "Ridu ei leitud." };
  return { items };
}

export const CSV_TEMPLATE =
  CSV_HEADERS.join(",") +
  "\n" +
  '"Pööningu väljaehitus",pooningu-valjaehitus,Jõõpre,Siseviimistlus,/uploads/projects/poon-1.jpg,/uploads/projects/poon-2.jpg,"Sarikate tugevdamine;Soojustus ja aurutõke;Siseviimistlus","/uploads/projects/g1.jpg;/uploads/projects/g2.jpg",jah,1\n' +
  '"Katuse ehitus 310",katuse-ehitus-310,Audru,Katused,/uploads/projects/katus-1.jpg,,"Sarikad;Roovitus;Plekk-katus","/uploads/projects/k1.jpg",ei,2';
