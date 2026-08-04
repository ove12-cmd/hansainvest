"use client";

import { useState } from "react";
import { CsvImportPanel } from "@/components/admin/CsvImportPanel";
import { AddProjectForm } from "@/components/admin/AddProjectForm";
import { ProjectsList } from "@/components/admin/ProjectsList";
import type { ProjectSummary } from "@/lib/projects";

export function AdminDashboard({ projects }: { projects: ProjectSummary[] }) {
  const [csvOpen, setCsvOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

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
              setFormOpen(false);
            }}
            className="rounded-pill bg-panel px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-border-soft"
          >
            {csvOpen ? "Sulge CSV import" : "Impordi CSV"}
          </button>
          <button
            type="button"
            onClick={() => {
              setFormOpen((v) => !v);
              setCsvOpen(false);
            }}
            className="rounded-pill bg-brand px-6.5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
          >
            {formOpen ? "Sulge vorm" : "+ Lisa uus projekt"}
          </button>
        </div>
      </div>

      {csvOpen && <CsvImportPanel />}
      {formOpen && <AddProjectForm />}

      <ProjectsList projects={projects} />
    </>
  );
}
