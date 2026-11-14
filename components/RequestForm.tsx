"use client";

import { useState } from "react";
import { SIZES, waLink } from "@/lib/data";

const field = "mt-1.5 w-full border-2 border-ink bg-paper px-3.5 py-3 focus:outline-none focus:ring-3 focus:ring-sky/40";

export function RequestForm() {
  const [f, setF] = useState({ model: "", size: "", budget: "", name: "" });
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (f.model.trim().length < 3) return setErr("Tell us which shoe, like “Jordan 4 Black Cat”.");
    if (!f.size) return setErr("Pick your size so we source the right pair.");
    setErr("");
    window.open(waLink([
      "Hi KGL Kicks! Can you find this pair for me?",
      `Shoe: ${f.model.trim()}`,
      `Size: EU ${f.size}`,
      f.budget ? `Budget: about ${f.budget} RWF` : "",
      f.name ? `Name: ${f.name}` : "",
    ].filter(Boolean).join("\n")), "_blank", "noopener");
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm font-semibold sm:col-span-2">Which shoe?
        <input className={field} value={f.model} onChange={(e) => set("model", e.target.value)} placeholder="Jordan 4 Black Cat, New Balance 550..." />
      </label>
      <label className="block text-sm font-semibold">Size (EU)
        <select className={field} value={f.size} onChange={(e) => set("size", e.target.value)}>
          <option value="">Choose</option>
          {SIZES.map((s) => <option key={s}>{s}</option>)}
          <option value="47+">47 or bigger</option>
        </select>
      </label>
      <label className="block text-sm font-semibold">Budget in RWF (optional)
        <input className={field} value={f.budget} onChange={(e) => set("budget", e.target.value.replace(/[^\d,]/g, ""))} inputMode="numeric" placeholder="200,000" />
      </label>
      <label className="block text-sm font-semibold sm:col-span-2">Your name (optional)
        <input className={field} value={f.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
      </label>
      {err && <p role="alert" className="font-semibold text-red-700 sm:col-span-2">{err}</p>}
      <button className="rounded-full bg-ink py-4 font-bold text-paper hover:bg-ink/85 sm:col-span-2">Send request on WhatsApp</button>
    </form>
  );
}
