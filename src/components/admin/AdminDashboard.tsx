"use client";

import { useState } from "react";
import { CsvImportPanel } from "@/components/admin/CsvImportPanel";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { ProjectsList } from "@/components/admin/ProjectsList";
import { Toast } from "@/components/ui/Toast";
import type { ProjectDetail } from "@/lib/projects";

type FormMode = { type: "add" } | { type: "edit"; project: ProjectDetail };

export function AdminDashboard({
  projects,
  categories,
  initialEditSlug,
}: {
  projects: ProjectDetail[];
  categories: string[];
  initialEditSlug?: string;
}) {
  const [csvOpen, setCsvOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode | null>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);

  function showToast(message: string) {
    setToast({ id: Date.now(), message });
  }

  // A sidebar link (e.g. "Vajab täiendamist") sets ?edit=<slug> and does a
  // client-side navigation within the same route — the component doesn't
  // remount, so a lazy useState initializer only catches the first load.
  // Adjusting state during render (React's documented pattern for deriving
  // state from a changed prop) instead of in an effect avoids the extra
  // render pass an effect-based setState would cause.
  const [handledEditSlug, setHandledEditSlug] = useState<string | undefined>(undefined);
  if (initialEditSlug && initialEditSlug !== handledEditSlug) {
    setHandledEditSlug(initialEditSlug);
    const match = projects.find((p) => p.slug === initialEditSlug);
    if (match) {
      setFormMode({ type: "edit", project: match });
      setCsvOpen(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-panel bg-white px-5 py-6 sm:px-8 sm:py-7">
        <div>
          <h1 className="mb-1.5 font-display text-[28px] font-semibold tracking-tight">Projektid</h1>
          <p className="text-sm font-medium text-muted-2">
            {projects.length} {projects.length === 1 ? "projekt" : "projekti"} veebilehel
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => {
              setCsvOpen((v) => !v);
              setFormMode(null);
            }}
            className="rounded-pill bg-panel px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-border-soft"
          >
            {csvOpen ? "Sulge CSV import" : "Impordi CSV"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormMode((m) => (m?.type === "add" ? null : { type: "add" }));
              setCsvOpen(false);
            }}
            className="rounded-pill bg-brand px-6.5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            {formMode?.type === "add" ? "Sulge vorm" : "+ Lisa uus projekt"}
          </button>
        </div>
      </div>

      {csvOpen && (
        <CsvImportPanel onImported={(count) => showToast(`${count} projekti imporditud.`)} />
      )}
      {formMode && (
        <ProjectForm
          key={formMode.type === "edit" ? formMode.project.id : "add"}
          project={formMode.type === "edit" ? formMode.project : undefined}
          categories={categories}
          onSaved={() => {
            showToast(formMode.type === "edit" ? "Muudatused salvestatud." : "Projekt lisatud.");
            if (formMode.type === "edit") setFormMode(null);
          }}
        />
      )}

      <ProjectsList
        projects={projects}
        onEdit={(project) => {
          setFormMode({ type: "edit", project });
          setCsvOpen(false);
        }}
        onDeleted={(title) => showToast(`Projekt "${title}" kustutatud.`)}
      />

      {toast && <Toast key={toast.id} message={toast.message} onClose={() => setToast(null)} />}
    </>
  );
}
