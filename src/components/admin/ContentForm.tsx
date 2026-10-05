"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { saveContentAction, type AddProjectState } from "@/app/admin/(protected)/actions";
import { ImageSlot } from "@/components/admin/ImageSlot";
import { Toast } from "@/components/ui/Toast";
import { EDITABLE_SECTIONS, type EditableField } from "@/lib/data/editable";

const INITIAL_STATE: AddProjectState = {};

const FIELD_CLASSES =
  "w-full rounded-xl border border-border-input px-3.5 py-3 text-[15px] outline-none transition-colors focus:border-ink";

function Field({ field, value }: { field: EditableField; value: string }) {
  // Images post their URL through a hidden input; the picker itself uploads.
  const [imageUrl, setImageUrl] = useState(value);

  if (field.type === "image") {
    return (
      <div className="max-w-xs">
        <input type="hidden" name={field.key} value={imageUrl} />
        <ImageSlot label={field.label} url={imageUrl} onUpload={setImageUrl} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={field.key} className="text-xs font-bold uppercase tracking-wide text-muted-3">
        {field.label}
      </label>
      {field.type === "text" ? (
        <input id={field.key} name={field.key} type="text" defaultValue={value} className={FIELD_CLASSES} />
      ) : (
        <textarea
          id={field.key}
          name={field.key}
          rows={field.type === "heading" ? 2 : field.type === "list" ? Math.max(3, value.split("\n").length) : 3}
          defaultValue={value}
          className={`${FIELD_CLASSES} resize-y`}
        />
      )}
      {field.type === "heading" && (
        <span className="text-[11.5px] font-medium text-muted-3">
          Reavahetus teeb uue rea. *Tärnide vahel* olev sõna on punane.
        </span>
      )}
      {field.type === "list" && (
        <span className="text-[11.5px] font-medium text-muted-3">
          Üks rida = üks punkt. Rea kustutamine eemaldab punkti, ridade järjekord on ka kuvamise järjekord.
        </span>
      )}
    </div>
  );
}

export function ContentForm({ saved }: { saved: Record<string, string> }) {
  const [state, formAction, pending] = useActionState(saveContentAction, INITIAL_STATE);
  const [toast, setToast] = useState<{ id: number } | null>(null);

  const stateRef = useRef(state);
  useEffect(() => {
    if (state !== stateRef.current && state.success) setToast({ id: Date.now() });
    stateRef.current = state;
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-3.5">
      {EDITABLE_SECTIONS.map((section) => (
        <section key={section.title} className="rounded-panel bg-white p-5 sm:p-8">
          <h2 className="mb-5 font-display text-lg font-semibold tracking-tight">{section.title}</h2>
          <div className="flex flex-col gap-4">
            {section.fields.map((field) => (
              <Field key={field.key} field={field} value={saved[field.key] ?? field.default} />
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-3.5 flex items-center gap-3 rounded-panel bg-white px-5 py-4 shadow-[0_8px_30px_rgba(0,0,0,0.10)] sm:px-8">
        <button
          type="submit"
          disabled={pending}
          className="rounded-pill bg-brand px-6.5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
        >
          {pending ? "Salvestan…" : "Salvesta muudatused"}
        </button>
        {state.error && <span className="text-sm font-semibold text-brand">{state.error}</span>}
      </div>

      {toast && <Toast key={toast.id} message="Muudatused salvestatud." onClose={() => setToast(null)} />}
    </form>
  );
}
