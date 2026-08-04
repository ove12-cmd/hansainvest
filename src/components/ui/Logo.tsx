import Image from "next/image";

type LogoProps = {
  variant?: "dark" | "light";
  className?: string;
};

export function Logo({ variant = "dark", className = "" }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Hansalux"
      width={550}
      height={164}
      className={`h-11 w-auto ${variant === "light" ? "invert brightness-0" : ""} ${className}`.trim()}
      priority
    />
  );
}
