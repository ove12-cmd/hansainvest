import { ElementType, ReactNode } from "react";

type TextVariant = "body" | "bodyLg" | "meta" | "eyebrow" | "label" | "quoteBody";

const VARIANT_CLASSES: Record<TextVariant, string> = {
  body: "text-[15.5px] leading-[1.65] font-medium text-muted",
  bodyLg: "text-[17px] leading-[1.72] font-medium text-muted",
  meta: "text-[13px] font-semibold text-muted-2",
  eyebrow:
    "inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-brand",
  label: "text-sm font-semibold",
  quoteBody: "text-[15px] leading-[1.7] font-medium text-muted-dark",
};

type TextProps = {
  as?: ElementType;
  variant?: TextVariant;
  className?: string;
  children: ReactNode;
};

export function Text({ as: Tag = "p", variant = "body", className = "", children }: TextProps) {
  return <Tag className={`${VARIANT_CLASSES[variant]} ${className}`.trim()}>{children}</Tag>;
}
