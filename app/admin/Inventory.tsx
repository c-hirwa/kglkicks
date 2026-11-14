"use client";

import Link from "next/link";
import { useMemo, useOptimistic, useState, useTransition } from "react";
import { SIZES, img, inStock, pairs, rwf, type Product, type Size } from "@/lib/data";
import { adjustStock, setHidden } from "./actions";

type Filter = "all" | "low" | "out" | "hidden";

export function Inventory({ products }: { products: Product[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const counts = useMemo(() => ({
    all: products.length,
    low: products.filter((p) => inStock(p) && pairs(p) <= 3).length,
    out: products.filter((p) => !inStock(p)).length,
    hidden: products.filter((p) => p.hidden).length,
  }), [products]);

  const list = products.filter((p) => {
    const hay = `${p.brand} ${p.model} ${p.colorway}`.toLowerCase();
    if (q && !q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
    if (filter === "low") return inStock(p) && pairs(p) <= 3;
    if (filter === "out") return !inStock(p);
    if (filter === "hidden") return p.hidden;
    return true;
  });

  const chips: [Filter, string][] = [["all", "All"], ["low", "Running low"], ["out", "Sold out"], ["hidden", "Hidden"]];

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center gap-3">
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search brand, model or colour"
          aria-label="Search shoes"
          className="min-w-0 flex-1 rounded-full border border-line bg-concrete px-5 py-3 placeholder:text-ink/35 focus:border-kgl focus:outline-none sm:max-w-xs" />
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter">
          {chips.map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)} aria-pressed={filter === k}
              className={`rounded-full border px-3.5 py-2 text-sm font-bold transition ${filter === k ? "border-kgl bg-kgl text-white" : "border-line bg-concrete text-ink/75 hover:border-ink"}`}>
              {label} <span className="ml-0.5 opacity-60">{counts[k]}</span>
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-line p-12 text-center">
          <p className="semiwide text-lg">{products.length ? "No shoes match." : "No shoes yet."}</p>
          <p className="mt-1 text-sm text-muted">{products.length ? "Try another search or filter." : "Add your first pair to start selling."}</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {list.map((p) => <Row key={p.slug} p={p} />)}
        </ul>
      )}
    </section>
  );
}

function Row({ p }: { p: Product }) {
  const [, start] = useTransition();
  const [stock, bump] = useOptimistic(p.stock, (s, [size, d]: [Size, 1 | -1]) => ({ ...s, [size]: Math.max(0, (s[size] ?? 0) + d) }));
  const [hidden, setHiddenOpt] = useOptimistic(p.hidden);
  const total = Object.values(stock).reduce<number>((s, n) => s + (n ?? 0), 0);

  const change = (size: Size, d: 1 | -1) => start(async () => { bump([size, d]); await adjustStock(p.slug, size, d); });
  const toggle = () => start(async () => { setHiddenOpt(!hidden); await setHidden(p.slug, !hidden); });

  return (
    <li className={`rounded-3xl border bg-concrete p-3 transition sm:p-4 ${hidden ? "border-dashed border-line opacity-70" : "border-line"}`}>
      <div className="flex gap-4">
        <Link href={`/admin/edit/${p.slug}`} className="shot size-20 shrink-0 overflow-hidden rounded-2xl sm:size-24">
          {p.photos[0] && <img src={img(p.photos[0])} alt="" className="size-full object-cover" />}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{p.brand}</p>
              <Link href={`/admin/edit/${p.slug}`} className="semiwide block leading-tight hover:text-kgl">{p.model} <span className="text-muted">&lsquo;{p.colorway}&rsquo;</span></Link>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-bold text-kgl">{rwf(p.price)}</span>
                {p.wasPrice && <s className="text-muted">{rwf(p.wasPrice)}</s>}
                {hidden && <Badge tone="muted">Hidden</Badge>}
                {total === 0 ? <Badge tone="red">Sold out</Badge> : total <= 3 ? <Badge tone="sun">{total} left</Badge> : <Badge tone="muted">{total} pairs</Badge>}
                {p.tag && <Badge tone="muted">{p.tag}</Badge>}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={toggle} className="rounded-full border border-line px-3.5 py-2 text-sm font-semibold hover:border-ink">
                {hidden ? "Show in shop" : "Hide"}
              </button>
              <Link href={`/admin/edit/${p.slug}`} className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-paper hover:bg-white">Edit</Link>
            </div>
          </div>
        </div>
      </div>

      {/* per-size stock, tap − / + to sell or restock a pair */}
      <div className="mt-3 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
        {SIZES.map((s) => {
          const n = stock[s] ?? 0;
          return (
            <div key={s} className={`rounded-2xl border p-1.5 text-center ${n === 0 ? "border-line/60 bg-paper/40" : n === 1 ? "border-sun/40 bg-sun/5" : "border-line bg-paper/70"}`}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted">EU {s}</p>
              <p className={`wide text-xl leading-tight ${n === 0 ? "text-ink/25" : ""}`} aria-live="polite">{n}</p>
              <div className="mt-0.5 flex justify-center gap-1">
                <button onClick={() => change(s, -1)} disabled={n === 0} aria-label={`One less in EU ${s}`}
                  className="grid size-7 place-items-center rounded-full bg-white/5 font-bold transition hover:bg-white/15 disabled:opacity-25">−</button>
                <button onClick={() => change(s, 1)} aria-label={`One more in EU ${s}`}
                  className="grid size-7 place-items-center rounded-full bg-kgl/20 font-bold text-kgl transition hover:bg-kgl hover:text-white">+</button>
              </div>
            </div>
          );
        })}
      </div>
    </li>
  );
}

function Badge({ tone, children }: { tone: "muted" | "red" | "sun"; children: React.ReactNode }) {
  const c = tone === "red" ? "bg-red-500/15 text-red-300 ring-red-400/30" : tone === "sun" ? "bg-sun/15 text-sun ring-sun/30" : "bg-white/5 text-ink/70 ring-white/10";
  return <span className={`rounded-full px-2 py-0.5 text-xs font-bold ring-1 ${c}`}>{children}</span>;
}
