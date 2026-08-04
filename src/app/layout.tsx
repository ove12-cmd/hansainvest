import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Ehitus ja remont Pärnus ning üle Eesti`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "et_EE",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Ehitus ja remont Pärnus ning üle Eesti`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/images/hero.png",
        width: 1277,
        height: 749,
        alt: "Hansaluxi meeskond siseviimistlust tegemas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Ehitus ja remont Pärnus ning üle Eesti`,
    description: SITE_DESCRIPTION,
    images: ["/images/hero.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="et" className={`${manrope.variable} ${spaceGrotesk.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased bg-surface text-ink">
        {children}
      </body>
    </html>
  );
}
