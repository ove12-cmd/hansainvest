const ESTONIAN_MAP: Record<string, string> = {
  ä: "a",
  ö: "o",
  õ: "o",
  ü: "u",
  š: "s",
  ž: "z",
};

export function slugify(input: string): string {
  return (input || "")
    .toLowerCase()
    .replace(/[äöõüšž]/g, (c) => ESTONIAN_MAP[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
