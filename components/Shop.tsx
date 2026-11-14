"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SIZES, brandsOf, inStock, newestFirst, type Size } from "@/lib/data";
import { useProducts } from "./ProductsProvider";
import { ProductCard } from "./ProductCard";

const PRICE_CAPS = [40000, 45000, 50000];

export function Shop() {
  const params = useSearchParams();
  const router = useRouter();
  const path = usePathname();
  const products = useProducts();
  const brands = brandsOf(products);
  const brand = params.get("brand");
  const size = Number(params.get("size")) as Size || null;
  const max = Number(params.get("max")) || null;
  const sort = params.get("sort") ?? "new";
  const all = params.get("all") === "1";

  const set = (k: string, v: string | number | null) => {
    const q = new URLSearchParams(params.toString());
    if (v === null || v === "") q.delete(k); else q.set(k, String(v));
    router.replace(`${path}?${q}`, { scroll: false });
  };

  const list = products
    .filter((p) => (!brand || p.brand === brand) && (!size || (p.stock[size] ?? 0) > 0) && (!max || p.price <= max) && (all || size || inStock(p)))
    .sort((a, b) => sort === "low" ? a.price - b.price : sort === "high" ? b.price - a.price : newestFirst(a, b));

  const chip = (on: boolean) => `rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors ${on ? "border-kgl bg-kgl text-white" : "border-line bg-concrete hover:border-ink"}`;
  const title = `${brand ?? "All sneakers"}${size ? ` in EU ${size}` : ""}`;

  return (
    <main className="relative mx-auto max-w-7xl px-4 pt-10 sm:px-6">
      <div className="pointer-events-none absolute -top-24 right-0 -z-10 size-[36rem] rounded-full bg-kgl/15 blur-[140px]" aria-hidden="true" />
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-kgl">KGL Kicks store</p>
      <h1 className="wide mt-2 text-4xl sm:text-6xl">{title}</h1>
      <p className="mt-1 text-muted" aria-live="polite">{list.length} {list.length === 1 ? "pair" : "pairs"}{size ? " we can deliver in your size today" : ""}</p>

      <div className="mt-8 space-y-4 rounded-[1.75rem] border border-line bg-concrete/70 p-5 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-14 text-sm font-semibold text-muted">Brand</span>
          {[null, ...brands].map((b) => (
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
                <input type="checkbox" checked={all} onChange={(e) => set("all", e.target.checked ? "1" : null)} className="size-4 accent-[#22a447]" /> Show sold out
              </label>
            )}
            <select aria-label="Sort" value={sort} onChange={(e) => set("sort", e.target.value === "new" ? null : e.target.value)} className="rounded-full border border-line bg-concrete px-3 py-1.5 text-sm font-bold">
              <option value="new">Newest</option>
              <option value="low">Price, low to high</option>
              <option value="high">Price, high to low</option>
            </select>
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-2xl bg-concrete p-10 text-center">
          <p className="semiwide text-xl">Nothing in that combination right now.</p>
          <p className="mt-1 text-muted">Try another size or price, or ask us to source it.</p>
          <Link href="/#request" className="mt-5 inline-block rounded-full bg-kgl px-6 py-3 font-bold text-white">Request a pair</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p, i) => <ProductCard key={p.slug} p={p} size={size} eager={i < 4} />)}
        </div>
      )}
    </main>
  );
}
