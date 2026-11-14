import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="mx-auto mt-10 max-w-sm sm:mt-20">
      <div className="rounded-[2rem] border border-line bg-concrete p-7 shadow-2xl shadow-black/50">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-kgl">Staff only</p>
        <h1 className="wide mt-2 text-3xl">Sign in</h1>
        <p className="mt-2 text-sm text-muted">Manage shoes, photos, prices and stock.</p>
        <LoginForm />
      </div>
    </div>
  );
}
