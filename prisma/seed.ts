import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PROJECTS = [
  {
    slug: "pooningu-valjaehitus",
    title: "Pööningu väljaehitus",
    location: "Jõõpre",
    category: "Siseviimistlus",
    sort: 1,
    featured: true,
    works: ["Sarikate tugevdamine", "Soojustus ja aurutõke", "Katuseakende paigaldus", "Vaheseinad ja laed", "Siseviimistlus"],
    summary: "Kasutuseta pööning ehitati välja täisväärtuslikuks elupinnaks.",
    description:
      "Omanik soovis kasvava pere jaoks kaks magamistuba ja pesuruumi. Vana pööning oli soojustamata, sarikad osaliselt niiskuskahjustusega ja katuseaknad puudusid.\n\nTugevdasime konstruktsiooni, ehitasime uue soojustus- ja aurutõkkekihi, paigaldasime katuseaknad ning tegime kogu siseviimistluse. Töö käis peres elamise ajal, seega hoidsime tolmu ja müra graafikus kokku lepitud akendes.",
    propertyType: "Eramu",
    area: "62 m²",
    duration: "7 nädalat",
    completedYear: "2025",
    image1Url: "/images/hero.png",
    image2Url: "/images/meist.png",
    beforeImageUrl: "/images/meist.png",
    afterImageUrl: "/images/hero.png",
    gallery: ["/images/vundamendid.png", "/images/laed.png", "/images/soojustus.png"],
  },
  {
    slug: "katuse-ehitus-310",
    title: "Katuse ehitus 310",
    location: "Audru",
    category: "Katused",
    sort: 2,
    works: ["Sarikad", "Roovitus", "Plekk-katus"],
  },
  {
    slug: "korvalhoone-ehitus",
    title: "Kõrvalhoone ehitus",
    location: "Pärnu",
    category: "Eramud",
    sort: 3,
    works: ["Lammutus", "Vundament"],
  },
  {
    slug: "korteri-kapitaalremont",
    title: "Korteri kapitaalremont",
    location: "Mõisaküla",
    category: "Siseviimistlus",
    sort: 4,
    works: ["Siseviimistlus"],
  },
  {
    slug: "alexela-takupoiss",
    title: "Alexela Täkupoiss",
    location: "Sauga",
    category: "Ärihooned",
    sort: 5,
    works: ["Sisetööd", "Fassaad"],
  },
  {
    slug: "papiniidu-fassaad",
    title: "Papiniidu fassaad",
    location: "Pärnu",
    category: "Fassaadid",
    sort: 6,
    works: ["Fassaad", "Karniisid"],
  },
  {
    slug: "eramu-vundament",
    title: "Eramu vundament",
    location: "Sindi",
    category: "Eramud",
    sort: 7,
    works: ["Kaevetööd", "Alusplaat"],
  },
  {
    slug: "fassaadi-soojustus",
    title: "Fassaadi soojustus",
    location: "Paikuse",
    category: "Fassaadid",
    sort: 8,
    works: ["Villsoojustus", "Krohv"],
  },
  {
    slug: "arihoone-siseviimistlus",
    title: "Ärihoone siseviimistlus",
    location: "Pärnu",
    category: "Ärihooned",
    sort: 9,
    works: ["Siseviimistlus"],
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: { passwordHash },
      create: { email: adminEmail, passwordHash },
    });
    console.log(`Admin user ready: ${adminEmail}`);
  } else {
    console.warn("ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin user seed.");
  }

  for (const project of PROJECTS) {
    const data = {
      ...project,
      works: JSON.stringify(project.works),
      gallery: JSON.stringify("gallery" in project ? project.gallery : []),
    };
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: data,
      create: data,
    });
  }
  console.log(`Seeded ${PROJECTS.length} projects.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
