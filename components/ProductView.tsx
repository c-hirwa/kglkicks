"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SIZES, SIZE_CHART, img, inStock, name, rwf, waLink, type Product, type Size } from "@/lib/data";
import { addToBag } from "@/lib/bag";
import { ProductCard } from "./ProductCard";
import { useProducts } from "./ProductsProvider";

type System = "EU" | "US" | "UK";

export function ProductView({ p }: { p: Product }) {
  const products = useProducts();
  const [photo, setPhoto] = useState(0);
  const [size, setSize] = useState<Size | null>(null);
  const [sys, setSys] = useState<System>("EU");
  const [guide, setGuide] = useState(false);
  const [nudge, setNudge] = useState(false);
  const out = !inStock(p);
  const related = products.filter((x) => x.slug !== p.slug && inStock(x)).sort((a, b) => Number(b.brand === p.brand) - Number(a.brand === p.brand) || Math.abs(a.price - p.price) - Math.abs(b.price - p.price)).slice(0, 4);

  const label = (s: Size) => (sys === "EU" ? String(s) : SIZE_CHART[s][sys === "US" ? 0 : 1]);

  function add() {
    if (!size) { setNudge(true); return; }
    addToBag(p.slug, size, p.stock[size] ?? 0);
  }

  return (
    <main className="relative mx-auto max-w-7xl px-4 sm:px-6">
      <div className="pointer-events-none absolute -top-20 left-0 -z-10 size-[40rem] rounded-full bg-kgl/15 blur-[140px]" aria-hidden="true" />
      <nav className="py-4 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-ink hover:underline">Shop</Link> / <Link href={`/shop?brand=${encodeURIComponent(p.brand)}`} className="hover:text-ink hover:underline">{p.brand}</Link>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        {/* gallery */}
        <div>
          <div className="shot relative overflow-hidden rounded-[2rem] shadow-[0_40px_100px_-30px_rgb(34_164_71/.45)] ring-1 ring-white/10">
            <img key={photo} src={img(p.photos[photo])} alt={name(p)} className="fade-in aspect-square w-full object-cover" />
            {p.photos.length > 1 && (
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button onClick={() => setPhoto((photo - 1 + p.photos.length) % p.photos.length)} className="grid size-11 place-items-center rounded-full bg-paper text-xl font-bold shadow" aria-label="Previous photo">‹</button>
                <button onClick={() => setPhoto((photo + 1) % p.photos.length)} className="grid size-11 place-items-center rounded-full bg-paper text-xl font-bold shadow" aria-label="Next photo">›</button>
              </div>
            )}
          </div>
          {p.photos.length > 1 && (
            <div className="mt-3 flex gap-3">
              {p.photos.map((ph, i) => (
                <button key={ph} onClick={() => setPhoto(i)} aria-label={`Photo ${i + 1}`} aria-current={photo === i}
                  className={`overflow-hidden rounded-xl border-2 ${photo === i ? "border-kgl" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={img(ph)} alt="" className="shot size-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* buy box */}
        <div className="lg:sticky lg:top-28 lg:self-start lg:rounded-[2rem] lg:border lg:border-line lg:bg-concrete/70 lg:p-8 lg:backdrop-blur">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-kgl">{p.brand}</p>
          <h1 className="wide mt-1 text-3xl leading-tight sm:text-4xl">{p.model} <span className="text-muted">&lsquo;{p.colorway}&rsquo;</span></h1>
          <p className="mt-4 inline-block rounded-full bg-kgl/12 px-4 py-1.5 text-2xl font-bold text-kgl ring-1 ring-kgl/30">
            {rwf(p.price)} {p.wasPrice && <s className="ml-2 text-lg font-normal text-muted">{rwf(p.wasPrice)}</s>}
          </p>
          <p className="mt-4 max-w-md text-ink/70">{p.blurb}</p>

          <div className="mt-8 flex items-center gap-3">
            <p className="font-bold">Size</p>
            <div className="flex overflow-hidden rounded-full border border-line text-xs font-bold" role="radiogroup" aria-label="Size system">
              {(["EU", "US", "UK"] as System[]).map((s) => (
                <button key={s} role="radio" aria-checked={sys === s} onClick={() => setSys(s)} className={`px-3 py-1 ${sys === s ? "bg-ink text-paper" : "text-muted hover:text-ink"}`}>{s}</button>
              ))}
            </div>
            <button onClick={() => setGuide(true)} className="ml-auto text-sm font-semibold underline underline-offset-4">Size guide</button>
          </div>
          <div className={`mt-3 grid grid-cols-5 gap-2 ${nudge && !size ? "animate-[tick_.3s]" : ""}`} role="radiogroup" aria-label="Choose a size">
            {SIZES.map((s) => {
              const n = p.stock[s] ?? 0;
              const on = size === s;
              return (
                <button key={s} role="radio" aria-checked={on} disabled={!n} onClick={() => { setSize(s); setNudge(false); }}
                  aria-label={`${sys} ${label(s)}${n ? "" : ", not available"}`}
                  className={`relative rounded-2xl border py-3 text-center font-bold transition-colors disabled:cursor-not-allowed disabled:border-line/60 disabled:text-ink/20 disabled:[background:linear-gradient(to_top_right,transparent_calc(50%-1px),var(--color-line),transparent_calc(50%+1px))]
                    ${on ? "border-kgl bg-kgl text-white" : "border-line bg-paper/60 hover:border-ink"}`}>
                  {label(s)}
                  {n === 1 && !on && <span className="absolute -right-1 -top-1 size-2.5 rounded-full bg-sun ring-2 ring-paper" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          <p className="mt-2 h-5 text-sm" aria-live="polite">
            {nudge && !size ? <span className="font-semibold text-red-400">Pick your size first.</span>
              : size ? ((p.stock[size] ?? 0) === 1 ? <span className="font-semibold text-sun">Last pair in {sys} {label(size)}.</span> : <span className="text-kgl">{sys} {label(size)} is in the store.</span>)
              : <span className="text-muted">Crossed-out sizes are sold out. A yellow dot means one pair left.</span>}
          </p>

          {out ? (
            <a href={waLink(`Hi KGL Kicks! Please let me know when ${name(p)} is back. My size is EU `)} target="_blank" rel="noopener"
              className="mt-4 block rounded-full bg-ink py-4 text-center font-bold text-paper">Tell me when it&apos;s back</a>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button onClick={add} className="rounded-full bg-ink py-4 font-bold text-paper transition hover:bg-white">Add to bag</button>
              <a href={size ? waLink(`Hi KGL Kicks! I'd like the ${name(p)} in EU ${size} (${rwf(p.price)}). Is it available today?`) : undefined}
                onClick={(e) => { if (!size) { e.preventDefault(); setNudge(true); } }} target="_blank" rel="noopener"
                className="rounded-full bg-kgl py-4 text-center font-bold text-white shadow-[0_10px_40px_-12px] shadow-kgl transition hover:bg-kgl-deep">Order on WhatsApp</a>
            </div>
          )}

          <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-paper/60 text-sm">
            <li className="flex gap-3 p-4"><span className="w-20 shrink-0 font-bold">Delivery</span><span className="text-ink/70">Free anywhere in Kigali. Abroad with DHL Express.</span></li>
            <li className="flex gap-3 p-4"><span className="w-20 shrink-0 font-bold">Bonus</span><span className="text-ink/70">Free socks with every pair.</span></li>
            <li className="flex gap-3 p-4"><span className="w-20 shrink-0 font-bold">Store</span><span className="text-ink/70">Want to try them on first? Visit us in Kigali.</span></li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="wide text-3xl">You might also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((r) => <ProductCard key={r.slug} p={r} />)}
          </div>
        </section>
      )}

      {guide && <SizeGuide onClose={() => setGuide(false)} />}
    </main>
  );
}

function SizeGuide({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Size guide">
      <div className="fade-in absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="fade-in relative w-full max-w-md rounded-3xl border border-line bg-concrete p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-line font-bold hover:bg-ink hover:text-paper" aria-label="Close size guide" autoFocus>×</button>
        <h2 className="wide text-2xl">Size guide</h2>
        <p className="mt-1 text-sm text-muted">Measure your foot heel to big toe and pick the closest length.</p>
        <table className="mt-4 w-full text-center text-sm">
          <thead><tr className="border-b border-ink/40">{["EU", "US", "UK", "Foot (cm)"].map((h) => <th key={h} className="py-2">{h}</th>)}</tr></thead>
          <tbody>
            {SIZES.map((s) => (
              <tr key={s} className="border-b border-line"><td className="py-1.5 font-bold">{s}</td>{SIZE_CHART[s].map((v, i) => <td key={i} className="text-ink/80">{v}</td>)}</tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm text-ink/80">Between sizes? Message us on WhatsApp and we&apos;ll tell you how that model fits.</p>
      </div>
    </div>
  );
}
