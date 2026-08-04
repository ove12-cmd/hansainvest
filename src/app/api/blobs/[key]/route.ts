import { NextResponse } from "next/server";
import { getProjectImagesStore } from "@/lib/images";

type Params = { params: Promise<{ key: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { key } = await params;

  const entry = await getProjectImagesStore().getWithMetadata(key, { type: "arrayBuffer" });
  if (!entry) {
    return new NextResponse("Not found", { status: 404 });
  }

  const contentType = typeof entry.metadata.contentType === "string" ? entry.metadata.contentType : "application/octet-stream";

  return new NextResponse(entry.data, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
