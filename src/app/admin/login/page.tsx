import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Admin — sisselogimine",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface p-4">
      <div className="w-full max-w-sm rounded-panel bg-white p-8">
        <div className="mb-7 flex items-center gap-2">
          <Logo />
          <span className="rounded-pill bg-panel px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-muted-2">
            ADMIN
          </span>
        </div>
        <h1 className="mb-6 font-display text-2xl font-semibold tracking-tight">Logi sisse</h1>
        <LoginForm />
      </div>
    </div>
  );
}
