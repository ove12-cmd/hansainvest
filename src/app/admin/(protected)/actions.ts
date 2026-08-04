"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { createProject, deleteProject, importProjectRows } from "@/lib/projects";
import { parseProjectsCsv, type CsvProjectRow } from "@/lib/csv";
import { extractHtmlListItems } from "@/lib/richtext";

async function requireSession() {
  const session = await getSession();
  if (!session.userId) {
    throw new Error("Unauthorized");
  }
}

export type AddProjectState = {
  error?: string;
  success?: boolean;
};

export async function addProjectAction(_prevState: AddProjectState, formData: FormData): Promise<AddProjectState> {
  await requireSession();

  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  if (!title || !location) {
    return { error: "Nimi ja asukoht on kohustuslikud." };
  }

  const category = String(formData.get("category") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const sortRaw = String(formData.get("sort") ?? "").trim();
  const worksRaw = String(formData.get("works") ?? "");
  const works =
    extractHtmlListItems(worksRaw) ??
    worksRaw
      .split("\n")
      .map((v) => v.trim())
      .filter(Boolean);
  const featured = formData.get("featured") === "on";
  const image1Url = String(formData.get("image1Url") ?? "").trim();
  const image2Url = String(formData.get("image2Url") ?? "").trim();

  await createProject({
    title,
    slug: slug || undefined,
    location,
    category: category || "Muu",
    works,
    featured,
    sort: sortRaw ? Number(sortRaw) : undefined,
    image1Url: image1Url || undefined,
    image2Url: image2Url || undefined,
  });

  revalidatePath("/admin");
  revalidatePath("/projektid");

  return { success: true };
}

export async function deleteProjectAction(id: string) {
  await requireSession();
  await deleteProject(id);
  revalidatePath("/admin");
  revalidatePath("/projektid");
}

export async function previewCsvAction(csvText: string): Promise<{ items: CsvProjectRow[]; error?: string }> {
  await requireSession();
  return parseProjectsCsv(csvText);
}

export async function importCsvAction(
  csvText: string
): Promise<{ count: number; failedImages: number; error?: string }> {
  await requireSession();
  const { items, error } = parseProjectsCsv(csvText);
  if (error) return { count: 0, failedImages: 0, error };

  const result = await importProjectRows(items);
  revalidatePath("/admin");
  revalidatePath("/projektid");
  return result;
}
