"use client";

import { useState } from "react";
import Image from "next/image";
import { compressImage, uploadImage } from "@/lib/uploadImage";

export function ImageSlot({
  label,
  url,
  onUpload,
}: {
  label: string;
  url: string;
  onUpload: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      onUpload(await uploadImage(await compressImage(file)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Üleslaadimine ebaõnnestus.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold uppercase tracking-wide text-muted-3">{label}</span>
      <label className="relative flex aspect-4/3 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-border bg-panel">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        {url ? (
          <Image src={url} alt={label} fill sizes="320px" className="object-cover" />
        ) : (
          <span className="px-3 text-center text-xs font-semibold text-muted-3">
            {uploading ? "Laadin…" : "Lohista pilt siia"}
          </span>
        )}
      </label>
      {error && <span className="text-xs font-semibold text-brand">{error}</span>}
    </div>
  );
}
