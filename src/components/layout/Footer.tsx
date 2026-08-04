import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { CONTACT, NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-7 rounded-panel bg-ink px-8 py-8 text-white sm:px-12">
      <Link href="/" className="group flex items-center gap-2">
        <Logo variant="light" className="transition-transform duration-300 ease-out group-hover:scale-105" />
      </Link>

      <nav aria-label="Jaluse menüü" className="flex flex-wrap gap-2">
        {NAV_LINKS.slice(1).map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-pill bg-white/[0.08] px-4.5 py-2 text-[13.5px] font-medium text-footer-nav transition-[background-color,color] duration-300 hover:bg-white/[0.14] hover:text-white"
          >
            {link.label}
          </Link>
        ))}
        <a
          href={CONTACT.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-pill bg-facebook px-4.5 py-2 text-[13.5px] font-semibold text-white transition-colors duration-300 hover:bg-facebook-hover"
        >
          Facebook
        </a>
      </nav>

      <p className="text-[13px] font-medium text-footer-copy">© Hansalux OÜ. Kõik õigused kaitstud.</p>
    </footer>
  );
}
