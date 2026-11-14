"use client";

import { useActionState } from "react";
import { login } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block text-sm font-semibold">Password
        <input name="password" type="password" required autoFocus autoComplete="current-password"
          className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-3 focus:border-kgl focus:outline-none focus:ring-3 focus:ring-kgl/30" />
      </label>
      {state?.error && <p role="alert" className="text-sm font-semibold text-red-400">{state.error}</p>}
      <button disabled={pending} className="w-full rounded-full bg-kgl py-3.5 font-bold text-white transition hover:bg-kgl-deep disabled:opacity-60">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
