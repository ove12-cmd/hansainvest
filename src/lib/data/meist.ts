export type Principle = {
  number: string;
  title: string;
  description: string;
};

export const PRINCIPLES: Principle[] = [
  {
    number: "01",
    title: "Ei mingit ettemaksu",
    description: "Maksad tehtud töö eest, mitte lubaduste eest.",
  },
  {
    number: "02",
    title: "Lahendame, ei peida",
    description: "Probleemide tekkimisel leiame lahenduse, mitte vabanduse.",
  },
  {
    number: "03",
    title: "Kodumaa tööjõud",
    description: "Eelistame Eesti mehi — kvaliteet ja vastutus on kohapeal.",
  },
  {
    number: "04",
    title: "Üks vastutav partner",
    description: "Kogu objekt ühe meeskonna käes, algusest lõpuni.",
  },
];
