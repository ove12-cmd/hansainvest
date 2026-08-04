import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-370 flex-col gap-3.5 p-3.5">
      <Header />
      <main className="flex flex-col gap-3.5">{children}</main>
      <Footer />
    </div>
  );
}
