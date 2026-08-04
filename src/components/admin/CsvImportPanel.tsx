"use client";

import { useState } from "react";
import { previewCsvAction, importCsvAction } from "@/app/admin/(protected)/actions";
import { CSV_HEADERS, CSV_TEMPLATE, type CsvProjectRow } from "@/lib/csv";

const FIELD_HINTS: Record<(typeof CSV_HEADERS)[number], string> = {
  Nimi: "tekst",
  Slug: "tekst",
  Asukoht: "tekst",
  Kategooria: "tekst",
  "Esimene pilt": "URL",
  "Teine pilt": "URL",
  "Tehtud tööd": "a;b;c",
  Pildid: "url;url",
  "Pane esimeseks": "jah/ei",
  Sort: "number",
};

export function CsvImportPanel() {
  const [csvText, setCsvText] = useState("");
  const [status, setStatus] = useState("Kleebi CSV ja vajuta Kontrolli.");
  const [preview, setPreview] = useState<CsvProjectRow[]>([]);
  const [busy, setBusy] = useState(false);

  async function handleCheck() {
    setBusy(true);
    const res = await previewCsvAction(csvText);
    setPreview(res.items);
    setStatus(res.error || `${res.items.length} rida valmis importimiseks.`);
    setBusy(false);
  }

  async function handleImport() {
    setBusy(true);
    setStatus("Laadin pilte ja impordin…");
    const res = await importCsvAction(csvText);
    if (res.error) {
      setStatus(res.error);
    } else {
      const imageNote =
        res.failedImages > 0
          ? ` ${res.failedImages} pilti ei õnnestunud alla laadida — kontrolli nende URL-e ja proovi uuesti.`
          : "";
      setStatus(`${res.count} projekti imporditud.${imageNote}`);
      setPreview([]);
      setCsvText("");
    }
    setBusy(false);
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    const text = await file.text();
    setCsvText(text);
    const res = await previewCsvAction(text);
    setPreview(res.items);
    setStatus(res.error || `${res.items.length} rida loetud failist „${file.name}”.`);
  }

  const templateHref = `data:text/csv;charset=utf-8,${encodeURIComponent(CSV_TEMPLATE)}`;

  return (
    <div className="rounded-panel bg-white p-5 sm:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-6">
        <div>
          <span className="mb-4 inline-flex items-center gap-2 rounded-pill bg-brand-tint px-3.5 py-1.5 text-xs font-bold text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            CSV import
          </span>
          <p className="max-w-[64ch] text-[15px] leading-[1.65] font-medium text-muted">
            Kleebi CSV sisu allolevasse kasti või lae fail. Esimene rida peab olema päis. Mitmiku väljad (Pildid,
            Tehtud tööd) eralda semikooloniga.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => {
              setCsvText(CSV_TEMPLATE);
              setStatus("Näidisandmed laetud — vajuta Kontrolli.");
              setPreview([]);
            }}
            className="rounded-pill bg-panel px-5 py-2.5 text-[13px] font-semibold"
          >
            Näidisrida
          </button>
          <a
            href={templateHref}
            download="hansalux-projektid.csv"
            className="rounded-pill bg-ink px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-black"
          >
            Laadi mall ↓
          </a>
        </div>
      </div>

      <ul className="mb-4.5 flex flex-wrap gap-2">
        {CSV_HEADERS.map((header) => (
          <li key={header} className="rounded-pill bg-panel px-4 py-2 text-xs font-semibold">
            {header} <span className="font-medium text-muted-4">{FIELD_HINTS[header]}</span>
          </li>
        ))}
      </ul>

      <textarea
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
        placeholder={CSV_HEADERS.join(",")}
        className="h-45 w-full resize-y rounded-xl border border-border-input p-4 font-mono text-[13.5px] leading-relaxed"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <label className="inline-flex cursor-pointer items-center gap-2.5 rounded-pill bg-panel px-5 py-2.5 text-[13.5px] font-semibold">
          Vali CSV fail
          <input
            type="file"
            accept=".csv,text/csv"
            className="sr-only"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </label>
        <div className="flex flex-wrap items-center gap-3.5">
          <span className="text-[13.5px] font-medium text-muted-3">{status}</span>
          <button
            type="button"
            onClick={handleCheck}
            disabled={busy}
            className="rounded-pill bg-panel px-6 py-3 text-sm font-semibold disabled:opacity-50"
          >
            Kontrolli
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={busy || preview.length === 0}
            className="rounded-pill bg-ink px-7.5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black disabled:opacity-50"
          >
            Impordi
          </button>
        </div>
      </div>

      {preview.length > 0 && (
        <div className="mt-6 border-t border-border-soft pt-5">
          <div className="mb-3.5 text-xs font-bold uppercase tracking-wide text-muted-3">
            Eelvaade — {preview.length} rida
          </div>
          {preview.map((row) => (
            <div
              key={row.slug}
              className="flex flex-col gap-2 border-b border-[#F4F4F2] py-3 sm:grid sm:items-center sm:gap-3.5 sm:grid-cols-[36px_minmax(140px,2fr)_minmax(90px,1fr)_minmax(0,1.4fr)_90px]"
            >
              <div className="flex items-center gap-3 sm:contents">
                <span className="font-display text-[13px] font-bold text-muted-3">{row.sort}</span>
                <span className="min-w-0 flex-1 overflow-hidden">
                  <span className="block truncate text-[15px] font-bold">{row.title}</span>
                  <span className="block truncate text-xs font-medium text-muted-4">/{row.slug}</span>
                </span>
              </div>
              <span className="truncate text-[13.5px] font-medium text-muted">{row.location}</span>
              <span className="truncate text-xs font-medium text-muted-3">
                {row.works.length} tööd · {row.gallery.length + (row.image1Url ? 1 : 0) + (row.image2Url ? 1 : 0)} pilti
              </span>
              <span
                className={`inline-block w-fit rounded-pill px-3 py-1.5 text-[11.5px] font-bold sm:justify-self-end ${
                  row.featured ? "bg-brand-tint text-brand" : "bg-panel text-muted-4"
                }`}
              >
                {row.featured ? "Esimene" : "—"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
