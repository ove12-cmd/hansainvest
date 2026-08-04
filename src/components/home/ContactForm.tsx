"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactState } from "@/lib/actions/contact";

const INPUT_CLASSES =
  "w-full rounded-xl border px-4 py-3.5 text-[14.5px] text-ink placeholder:text-muted-5 transition-colors duration-200 focus:border-ink focus:outline-none";
const INITIAL_STATE: ContactState = { errors: {}, success: false };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, INITIAL_STATE);

  if (state.success) {
    return (
      <div className="flex flex-col gap-2 rounded-panel bg-white p-8 text-center">
        <p className="text-lg font-bold text-ink">Aitäh! Päring on saadetud.</p>
        <p className="text-[13px] font-medium text-muted-4">
          {state.sentName ? `${state.sentName}, v` : "V"}õtame ühendust ühe tööpäeva jooksul.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-panel bg-white p-8">
      <p className="mb-1 text-[17px] font-bold text-ink">Küsi tasuta pakkumist</p>

      <div>
        <label htmlFor="contact-name" className="sr-only">
          Nimi
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Nimi"
          className={`${INPUT_CLASSES} ${state.errors.name ? "border-brand" : "border-border-input"}`}
        />
        {state.errors.name && <p className="mt-1 text-xs font-semibold text-brand">{state.errors.name}</p>}
      </div>

      <div>
        <label htmlFor="contact-info" className="sr-only">
          Telefon või e-post
        </label>
        <input
          id="contact-info"
          name="contact"
          type="text"
          placeholder="Telefon või e-post"
          className={`${INPUT_CLASSES} ${state.errors.contact ? "border-brand" : "border-border-input"}`}
        />
        {state.errors.contact && <p className="mt-1 text-xs font-semibold text-brand">{state.errors.contact}</p>}
      </div>

      <div>
        <label htmlFor="contact-message" className="sr-only">
          Mida plaanid ehitada?
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={3}
          placeholder="Mida plaanid ehitada?"
          className={`${INPUT_CLASSES} resize-none ${state.errors.message ? "border-brand" : "border-border-input"}`}
        />
        {state.errors.message && <p className="mt-1 text-xs font-semibold text-brand">{state.errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-pill bg-brand py-3.5 text-center text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60"
      >
        {pending ? "Saadan…" : "Saada päring"}
      </button>
      <p className="text-center text-xs font-medium text-muted-4">Vastame tavaliselt ühe tööpäeva jooksul.</p>
    </form>
  );
}
