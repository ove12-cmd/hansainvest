import { ReactNode } from "react";

type BadgeVariant = "tint" | "onDark" | "onBrand";

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  tint: "bg-brand-tint text-brand",
  onDark: "bg-white/[0.08] text-accent-dark",
  onBrand: "bg-white/[0.16] text-white",
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  tint: "bg-brand",
  onDark: "bg-brand",
  onBrand: "bg-white",
};

type BadgeProps = {
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
  children: ReactNode;
};

export function Badge({ variant = "tint", dot = true, className = "", children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-pill px-3.5 py-1.5 text-xs font-bold ${VARIANT_CLASSES[variant]} ${className}`.trim()}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full animate-pulse-dot ${DOT_CLASSES[variant]}`} />}
      {children}
    </span>
  );
}
