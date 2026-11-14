"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PRODUCTS, SIZES, inStock, type Brand, type Size } from "@/lib/data";
import { ProductCard } from "./ProductCard";

const PRICE_CAPS = [150000, 200000, 350000];

export function Shop() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const brand = params.get("brand") as Brand | null;
  const size = Number(params.get("size")) as Size || null;
  const max = Number(params.get("max")) || null;
  const sort = params.get("sort") ?? "new";
  const all = params.get("all") === "1";

  const set = (k: string, v: string | number | null) => {
    const q = new URLSearchParams(params.toString());
    if (v === null || v === "") q.delete(k); else q.set(k, String(v));
    router.replace(`${path}?${q}`, { scroll: false });
  };

  const list = PRODUCTS
    .filter((p) => (!brand || p.brand === brand) && (!size || (p.stock[size] ?? 0) > 0) && (!max || p.price <= max) && (all || size || inStock(p)))
    .sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : a.addedDaysAgo - b.addedDaysAgo);

  const chip = (on: boolean) => `border-2 px-3.5 py-1.5 text-sm font-bold transition-colors ${on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`;
  const title = `${brand ?? "All sneakers"}${size ? ` in EU ${size}` : ""}`;

  return (
    <main className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <h1 className="wide text-4xl sm:text-5xl">{title}</h1>
      <p className="mt-1 text-muted" aria-live="polite">{list.length} {list.length === 1 ? "pair" : "pairs"}{size ? " we can deliver in your size today" : ""}</p>

      <div className="mt-6 space-y-4 border-y border-ink py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-14 text-sm font-semibold text-muted">Brand</span>
          {([null, "Jordan", "Nike", "Adidas"] as const).map((b) => (
            <button key={b ?? "all"} onClick={() => set("brand", b)} aria-pressed={brand === b} className={chip(brand === b)}>{b ?? "All"}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-14 text-sm font-semibold text-muted">Size</span>
          {SIZES.map((s) => (
            <button key={s} onClick={() => set("size", size === s ? null : s)} aria-pressed={size === s} className={`${chip(size === s)} w-12 px-0`}>{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-14 text-sm font-semibold text-muted">Price</span>
          <button onClick={() => set("max", null)} aria-pressed={!max} className={chip(!max)}>Any</button>
          {PRICE_CAPS.map((c) => (
            <button key={c} onClick={() => set("max", c)} aria-pressed={max === c} className={chip(max === c)}>Under {c / 1000}k</button>
          ))}
          <div className="ml-auto flex items-center gap-4">
            {!size && (
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={all} onChange={(e) => set("all", e.target.checked ? "1" : null)} className="size-4 accent-ink" /> Show sold out
              </label>
            )}
            <select aria-label="Sort" value={sort} onChange={(e) => set("sort", e.target.value === "new" ? null : e.target.value)} className="border-2 border-ink bg-paper px-3 py-1.5 text-sm font-bold">
              <option value="new">Newest</option>
              <option value="low">Price, low to high</option>
              <option value="high">Price, high to low</option>
            </select>
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 bg-concrete p-10 text-center">
          <p className="semiwide text-xl">Nothing in that combination right now.</p>
          <p className="mt-1 text-muted">Try another size or price, or ask us to source it.</p>
          <Link href="/#request" className="mt-5 inline-block rounded-full bg-ink px-6 py-3 font-bold text-paper">Request a pair</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p, i) => <ProductCard key={p.slug} p={p} size={size} eager={i < 4} />)}
        </div>
      )}
    </main>
  );
}
