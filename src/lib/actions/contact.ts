"use server";

import { Resend } from "resend";
import { CONTACT } from "@/lib/constants";

export type ContactFormErrors = {
  name?: string;
  contact?: string;
  message?: string;
};

export type ContactState = {
  errors: ContactFormErrors;
  success: boolean;
  sentName?: string;
};

function validate(name: string, contact: string, message: string): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!name.trim()) errors.name = "Palun sisesta oma nimi.";

  const trimmedContact = contact.trim();
  if (!trimmedContact) {
    errors.contact = "Lisa telefon või e-post.";
  } else {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedContact);
    const digits = trimmedContact.replace(/[^0-9]/g, "");
    if (!isEmail && digits.length < 7) errors.contact = "Kontrolli telefoni või e-posti.";
  }

  if (message.trim().length < 10) {
    errors.message = "Kirjelda tööd veidi täpsemalt (vähemalt 10 tähemärki).";
  }

  return errors;
}

export async function submitContactForm(_prevState: ContactState, formData: FormData): Promise<ContactState> {
  const name = String(formData.get("name") ?? "");
  const contact = String(formData.get("contact") ?? "");
  const kind = String(formData.get("kind") ?? "");
  const message = String(formData.get("message") ?? "");

  const errors = validate(name, contact, message);
  if (Object.keys(errors).length > 0) {
    return { errors, success: false };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || CONTACT.email;

  if (!apiKey) {
    console.warn(
      `[contact] RESEND_API_KEY is not set — lead was validated but NOT emailed. Name: ${name}, Contact: ${contact}, Kind: ${kind}, Message: ${message}`
    );
  } else {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: "Hansalux veebileht <onboarding@resend.dev>",
      to,
      replyTo: contact.includes("@") ? contact : undefined,
      subject: `Uus päring: ${name.trim()}${kind ? ` (${kind})` : ""}`,
      text: `Nimi: ${name.trim()}\nKontakt: ${contact.trim()}\nTöö liik: ${kind || "—"}\n\n${message.trim()}`,
    });

    if (error) {
      console.error("[contact] Resend send failed:", error);
      return {
        errors: { message: "Saatmine ebaõnnestus. Palun helista või kirjuta otse." },
        success: false,
      };
    }
  }

  return { errors: {}, success: true, sentName: name.trim().split(" ")[0] };
}
