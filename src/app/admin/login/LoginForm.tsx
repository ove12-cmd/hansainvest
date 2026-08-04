"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth";

const INITIAL_STATE: LoginState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, INITIAL_STATE);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-2">
          E-post
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-xl border border-border-input px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-2">
          Parool
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-border-input px-4 py-3 text-[15px] text-ink outline-none transition-colors focus:border-ink"
        />
      </div>

      {state.error && <p className="text-sm font-semibold text-brand">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-pill bg-ink py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-black disabled:opacity-60"
      >
        {pending ? "Kontrollin…" : "Logi sisse"}
      </button>
    </form>
  );
}
