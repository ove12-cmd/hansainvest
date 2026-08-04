export type ServiceDetail = {
  number: string;
  title: string;
  description: string;
  tags: string[];
  image: { src: string; alt: string } | null;
  imageFirst: boolean;
};

export const SERVICES_DETAIL: ServiceDetail[] = [
  {
    number: "01",
    title: "Vundamendid ja soojustus",
    description:
      "Kaevetööd, alusplaadid, lintvundamendid ja soojustatud vundamendisüsteemid. Teeme ka olemasolevate vundamentide tugevdamist ja hüdroisolatsiooni.",
    tags: ["Alusplaat", "Lintvundament", "Hüdroisolatsioon"],
    image: { src: "/images/vundamendid.png", alt: "Vundamendi- ja soojustustööd" },
    imageFirst: false,
  },
  {
    number: "02",
    title: "Seinte ladumine",
    description:
      "Kandvad ja vaheseinad kõigist levinud materjalidest. Töötame nii uusehitistel kui rekonstrueerimisel, sh avade laiendamine ja sillused.",
    tags: ["Fibo", "Plokk", "Tellis", "Bauroc"],
    image: { src: "/images/seinad.png", alt: "Seinte ladumine" },
    imageFirst: true,
  },
  {
    number: "03",
    title: "Laed ja vahelaed",
    description:
      "Puit- ja betoonvahelaed, ripplaed ning laekonstruktsioonide tugevdamine. Pööningukorruse väljaehitus koos soojustuse ja aurutõkkega.",
    tags: ["Puitvahelagi", "Ripplagi", "Pööningu väljaehitus"],
    image: { src: "/images/laed.png", alt: "Vahelae konstruktsioon pööningul" },
    imageFirst: false,
  },
  {
    number: "04",
    title: "Katused ja sarikad",
    description:
      "Sarikakonstruktsioonid, roovitus, aluskate ja katusekattematerjali paigaldus. Vanade katuste vahetus koos räästaste ja vihmaveesüsteemiga.",
    tags: ["Sarikad", "Plekk-katus", "Kivikatus", "Vihmaveesüsteem"],
    image: { src: "/images/katused.png", alt: "Katused ja sarikad" },
    imageFirst: true,
  },
  {
    number: "05",
    title: "Soojustus ja tuuletõkked",
    description:
      "Seinte, katuslagede ja põrandate soojustamine koos korrektse auru- ja tuuletõkkega. Õigesti tehtud soojustus on odavaim viis küttearvet vähendada.",
    tags: ["Villsoojustus", "Aurutõke", "Tuuletõke"],
    image: { src: "/images/soojustus.png", alt: "Seinte soojustus ja aurutõke" },
    imageFirst: false,
  },
  {
    number: "06",
    title: "Fassaadid",
    description:
      "Krohvfassaadid, puitlaudis ja plaatfassaadid koos aluskonstruktsiooni ja karniisidega. Teeme ka olemasolevate fassaadide remonti ja värvimist.",
    tags: ["Krohv", "Laudis", "Värvimine", "Karniisid"],
    image: { src: "/images/fassaadid.png", alt: "Valminud fassaad — krohv ja laudis" },
    imageFirst: true,
  },
];
