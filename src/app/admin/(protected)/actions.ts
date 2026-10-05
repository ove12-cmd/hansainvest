"use server";

import { revalidatePath, updateTag } from "next/cache";
import { getSession } from "@/lib/session";
import { createProject, updateProject, deleteProject, importProjectRows, PROJECTS_TAG } from "@/lib/projects";
import { parseProjectsCsv, type CsvProjectRow } from "@/lib/csv";
import { extractHtmlListItems } from "@/lib/richtext";
import { saveContent, CONTENT_TAG } from "@/lib/content";
import { EDITABLE_FIELDS } from "@/lib/data/editable";

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

function parseWorksField(worksRaw: string): string[] {
  return (
    extractHtmlListItems(worksRaw) ??
    worksRaw
      .split("\n")
      .map((v) => v.trim())
      .filter(Boolean)
  );
}

function parseGalleryField(galleryRaw: string): string[] {
  try {
    const parsed = JSON.parse(galleryRaw || "[]");
    return Array.isArray(parsed) ? parsed.filter((v) => typeof v === "string") : [];
  } catch {
    return [];
  }
}

function readProjectFormData(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const slug = String(formData.get("slug") ?? "").trim();
  const sortRaw = String(formData.get("sort") ?? "").trim();
  const works = parseWorksField(String(formData.get("works") ?? ""));
  const gallery = parseGalleryField(String(formData.get("gallery") ?? ""));
  const featured = formData.get("featured") === "on";
  const image1Url = String(formData.get("image1Url") ?? "").trim();
  const image2Url = String(formData.get("image2Url") ?? "").trim();

  return {
    title,
    location,
    category: category || "Muu",
    slug: slug || undefined,
    works,
    gallery,
    featured,
    sort: sortRaw ? Number(sortRaw) : undefined,
    image1Url: image1Url || undefined,
    image2Url: image2Url || undefined,
  };
}

export async function addProjectAction(_prevState: AddProjectState, formData: FormData): Promise<AddProjectState> {
  await requireSession();

  const input = readProjectFormData(formData);
  if (!input.title || !input.location) {
    return { error: "Nimi ja asukoht on kohustuslikud." };
  }

  await createProject(input);

  revalidatePath("/admin");
  updateTag(PROJECTS_TAG);

  return { success: true };
}

export async function updateProjectAction(
  _prevState: AddProjectState,
  formData: FormData
): Promise<AddProjectState> {
  await requireSession();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) return { error: "Projekti ID puudub." };

  const input = readProjectFormData(formData);
  if (!input.title || !input.location) {
    return { error: "Nimi ja asukoht on kohustuslikud." };
  }

  await updateProject(id, input);

  revalidatePath("/admin");
  updateTag(PROJECTS_TAG);

  return { success: true };
}

export async function deleteProjectAction(id: string) {
  await requireSession();
  await deleteProject(id);
  revalidatePath("/admin");
  updateTag(PROJECTS_TAG);
}

export async function saveContentAction(
  _prevState: AddProjectState,
  formData: FormData
): Promise<AddProjectState> {
  await requireSession();

  const entries = Object.fromEntries(
    // Textareas post CRLF; the renderer splits on \n.
    EDITABLE_FIELDS.map((field) => [field.key, String(formData.get(field.key) ?? "").replace(/\r\n/g, "\n").trim()])
  );
  await saveContent(entries);

  // Every page that reads this is force-dynamic, so clearing the data cache is
  // enough — no revalidatePath, which would remount this form mid-save.
  updateTag(CONTENT_TAG);

  return { success: true };
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
  updateTag(PROJECTS_TAG);
  return result;
}
