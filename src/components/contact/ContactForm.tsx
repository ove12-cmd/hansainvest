"use client";

import { useActionState, useState } from "react";
import { submitContactForm, type ContactState } from "@/lib/actions/contact";

const KINDS = ["Üldehitus", "Katus", "Fassaad", "Remont"];
const INITIAL_STATE: ContactState = { errors: {}, success: false };

const FIELD_CLASSES =
  "w-full rounded-xl border px-4 py-3.5 text-[15px] text-ink outline-none transition-colors duration-200 focus:border-ink";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, INITIAL_STATE);
  const [kind, setKind] = useState(KINDS[0]);

  if (state.success) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 rounded-panel bg-white p-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-tint text-2xl font-extrabold text-brand">
          ✓
        </span>
        <p className="font-display text-2xl font-semibold tracking-tight">Päring saadetud</p>
        <p className="max-w-[34ch] text-[15.5px] leading-[1.65] font-medium text-muted">
          Aitäh, {state.sentName || "sõber"}! Võtame ühendust ühe tööpäeva jooksul.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-panel bg-white p-9">
      <p className="mb-1 font-display text-[22px] font-semibold tracking-tight">Küsi tasuta pakkumist</p>

      <div>
        <label htmlFor="contact-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-3">
          Nimi
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Sinu nimi"
          className={`${FIELD_CLASSES} ${state.errors.name ? "border-brand" : "border-border-input"}`}
        />
        {state.errors.name && <p className="mt-1.5 text-xs font-semibold text-brand">{state.errors.name}</p>}
      </div>

      <div>
        <label htmlFor="contact-info" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-3">
          Telefon või e-post
        </label>
        <input
          id="contact-info"
          name="contact"
          type="text"
          placeholder="+372 …"
          className={`${FIELD_CLASSES} ${state.errors.contact ? "border-brand" : "border-border-input"}`}
        />
        {state.errors.contact && <p className="mt-1.5 text-xs font-semibold text-brand">{state.errors.contact}</p>}
      </div>

      <div>
        <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-3">Töö liik</span>
        <input type="hidden" name="kind" value={kind} />
        <div className="flex flex-wrap gap-2">
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              aria-pressed={kind === k}
              className={`rounded-pill px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 active:scale-95 ${
                kind === k ? "bg-ink text-white" : "bg-panel hover:bg-border-soft"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-3"
        >
          Kirjeldus
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={3}
          placeholder="Mida plaanid ehitada? Objekti asukoht ja ligikaudne maht."
          className={`${FIELD_CLASSES} resize-y ${state.errors.message ? "border-brand" : "border-border-input"}`}
        />
        {state.errors.message && <p className="mt-1.5 text-xs font-semibold text-brand">{state.errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-pill bg-brand py-4 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Saadan…" : "Saada päring"}
      </button>
      <p className="text-center text-xs font-medium text-muted-4">Vastame tavaliselt ühe tööpäeva jooksul.</p>
    </form>
  );
}
