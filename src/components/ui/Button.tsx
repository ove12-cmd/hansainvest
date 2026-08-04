import Link from "next/link";
import { ReactNode } from "react";

type ButtonVariant = "solid" | "brand" | "outline" | "ghost" | "ghostOnBrand" | "onBrand" | "outlineOnBrand";

const BASE =
  "inline-flex items-center justify-center rounded-pill font-semibold transition-[background-color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(.22,.61,.36,1)] active:scale-[0.96] active:duration-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  solid: "bg-ink text-white hover:bg-black",
  brand: "bg-brand text-white hover:bg-brand-hover",
  outline: "border border-border text-ink hover:border-ink",
  ghost: "bg-white/[0.16] text-white hover:bg-white hover:text-brand",
  ghostOnBrand: "bg-panel text-ink hover:bg-border-soft",
  onBrand: "bg-white text-ink hover:bg-ink hover:text-white",
  outlineOnBrand: "border border-white/45 text-white hover:border-white",
};

const SIZE_CLASSES = {
  md: "px-8 py-4 text-sm",
  sm: "px-6 py-3 text-[13.5px]",
};

type CommonProps = {
  variant?: ButtonVariant;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
  children: ReactNode;
};

type ButtonProps =
  | (CommonProps & { href: string; type?: never; onClick?: never; ariaLabel?: never; disabled?: never })
  | (CommonProps & {
      href?: undefined;
      type?: "button" | "submit";
      onClick?: () => void;
      ariaLabel?: string;
      disabled?: boolean;
    });

export function Button(props: ButtonProps) {
  const { variant = "solid", size = "md", className = "", children } = props;
  const classes = `${BASE} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`.trim();

  if (props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      aria-label={props.ariaLabel}
      disabled={props.disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
