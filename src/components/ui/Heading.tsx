import { ElementType, ReactNode } from "react";

type HeadingVariant = "hero" | "section" | "sectionLg" | "sectionXl" | "panel" | "quote";

const VARIANT_CLASSES: Record<HeadingVariant, string> = {
  hero: "font-display font-semibold text-hero text-balance",
  section: "font-display font-semibold text-h2 text-balance",
  sectionLg: "font-display font-semibold text-h2-lg",
  sectionXl: "font-display font-semibold text-h2-xl",
  panel: "font-display font-semibold text-h3",
  quote: "font-display font-medium text-quote",
};

const LEVEL_TAG: Record<number, ElementType> = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

type HeadingProps = {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: HeadingVariant;
  className?: string;
  children: ReactNode;
  id?: string;
};

export function Heading({ level, variant = "section", className = "", children, id }: HeadingProps) {
  const Tag = LEVEL_TAG[level];
  return (
    <Tag id={id} className={`${VARIANT_CLASSES[variant]} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
