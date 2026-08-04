# Hansalux

Marketing site + admin CMS for Hansalux OÜ, built with Next.js 16 (App Router), Tailwind CSS v4, and Prisma (SQLite).

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the env template and fill in real values:

   ```bash
   cp .env.example .env
   ```

   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the single admin login, seeded into the database (change the password before deploying for real).
   - `SESSION_SECRET` — any random string 32+ characters long (used to encrypt the admin session cookie).
   - `RESEND_API_KEY` / `CONTACT_TO_EMAIL` — needed for the Kontakt page's form to actually deliver leads by email. Sign up at [resend.com](https://resend.com) for a free API key. Leaving this blank still lets the form validate and log submissions server-side, it just won't send an email.

3. Create the database and seed it (admin user + example projects):

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) for the site, and [http://localhost:3000/admin](http://localhost:3000/admin) for the project admin (log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Managing projects

Projects shown on `/projektid` are stored in the database, not hardcoded. Add them via `/admin`:

- **One at a time** — the "+ Lisa uus projekt" form, with drag-and-drop image upload.
- **In bulk** — "Impordi CSV". The expected columns are `Nimi,Slug,Asukoht,Kategooria,Esimene pilt,Teine pilt,Tehtud tööd,Pildid,Pane esimeseks,Sort` (semicolon-separate multi-value fields like `Tehtud tööd` and `Pildid`). Download a starter template from within the CSV import panel.

Uploaded images are saved to `public/uploads/projects/` on disk — this project assumes a traditional server/VPS deployment with a persistent filesystem, not a serverless host.

## Notable structure

- `src/app/(site)/` — public marketing pages (shared Header/Footer layout)
- `src/app/admin/` — the CMS (`/admin/login` is public, everything else requires a session)
- `src/proxy.ts` — gates `/admin/**` and `/api/admin/**` behind the session cookie
- `prisma/schema.prisma` — `AdminUser` and `Project` models
- `src/lib/projects.ts` / `src/lib/csv.ts` — project data access + CSV parsing
