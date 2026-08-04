export type Stat = {
  value: string;
  count?: number;
  suffix?: string;
  label: string;
  variant: "light" | "brand";
};

export const HERO_STATS: Stat[] = [
  { value: "100+", count: 100, suffix: "+", label: "valminud objekti üle Eesti", variant: "light" },
  { value: "0 €", label: "ettemaksu — maksad tehtud töö eest", variant: "brand" },
  { value: "Eesti", label: "kodumaa tööjõud", variant: "light" },
];

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Ülevaatus",
    description: "Tuleme kohale, vaatame objekti üle ja kuulame sinu soovid.",
  },
  {
    number: "02",
    title: "Aus pakkumine",
    description: "Selge hind ja ajakava — ilma peidetud ridadeta.",
  },
  {
    number: "03",
    title: "Ehitus",
    description: "Üks meeskond objektil, sina saad regulaarselt ülevaate.",
  },
  {
    number: "04",
    title: "Üleandmine",
    description: "Vaatame töö koos üle ja alles siis tasud tehtud töö eest.",
  },
];

export const ABOUT_TAGS: { label: string; emphasis?: boolean }[] = [
  { label: "Ei mingit ettemaksu" },
  { label: "Lahendame, ei peida" },
  { label: "Kodumaa tööjõud" },
  { label: "Üks vastutav partner" },
  { label: "Kvaliteedigarantii", emphasis: true },
];

export type ServiceLine = {
  number: string;
  title: string;
  note?: string;
};

export const SERVICE_TAGS = ["Eramud", "Ärihooned", "Renoveerimine", "Juurdeehitus"];

export const SERVICE_LINES: ServiceLine[] = [
  { number: "01", title: "Vundamendid ja soojustus" },
  { number: "02", title: "Seinte ladumine", note: "Fibo, plokk, tellis, Bauroc" },
  { number: "03", title: "Laed ja vahelaed" },
  { number: "04", title: "Katused ja sarikad" },
  { number: "05", title: "Soojustus ja tuuletõkked" },
  { number: "06", title: "Fassaadid", note: "krohv, laudis, värvimine" },
];
