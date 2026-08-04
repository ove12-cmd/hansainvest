import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSession } from "@/lib/session";
import { getProjectImagesStore, blobUrl } from "@/lib/images";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fail puudub." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Toetatud on ainult JPG, PNG, WebP ja AVIF pildid." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "Pilt on liiga suur (max 8 MB)." }, { status: 400 });
  }

  const key = randomUUID();
  await getProjectImagesStore().set(key, file, { metadata: { contentType: file.type } });

  return NextResponse.json({ url: blobUrl(key) });
}
