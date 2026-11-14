"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PRODUCTS, SIZES, SIZE_CHART, bySlug, img, inStock, name, rwf, waLink, type Size } from "@/lib/data";
import { addToBag } from "@/lib/bag";
import { ProductCard } from "./ProductCard";

type System = "EU" | "US" | "UK";

export function ProductView({ slug }: { slug: string }) {
  const p = bySlug(slug)!;
  const [photo, setPhoto] = useState(0);
  const [size, setSize] = useState<Size | null>(null);
  const [sys, setSys] = useState<System>("EU");
  const [guide, setGuide] = useState(false);
  const [nudge, setNudge] = useState(false);
  const out = !inStock(p);
  const related = PRODUCTS.filter((x) => x.slug !== p.slug && inStock(x)).sort((a, b) => Number(b.brand === p.brand) - Number(a.brand === p.brand) || Math.abs(a.price - p.price) - Math.abs(b.price - p.price)).slice(0, 4);

  const label = (s: Size) => (sys === "EU" ? String(s) : SIZE_CHART[s][sys === "US" ? 0 : 1]);
  const left = size ? p.stock[size] ?? 0 : 0;

  function add() {
    if (!size) { setNudge(true); return; }
    addToBag(p.slug, size);
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6">
      <nav className="py-4 text-sm text-muted" aria-label="Breadcrumb">
        <Link href="/shop" className="hover:text-ink hover:underline">Shop</Link> / <Link href={`/shop?brand=${p.brand}`} className="hover:text-ink hover:underline">{p.brand}</Link>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
        {/* gallery */}
        <div>
          <div className="relative bg-concrete">
            <img key={photo} src={img(p.photos[photo], 1200, 1200)} alt={name(p)} className="fade-in aspect-square w-full object-cover" />
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
                  className={`border-2 ${photo === i ? "border-ink" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={img(ph, 200, 200)} alt="" className="size-20 bg-concrete object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* buy box */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="font-semibold text-muted">{p.brand}</p>
          <h1 className="wide mt-1 text-3xl leading-tight sm:text-4xl">{p.model} <span className="text-muted">&lsquo;{p.colorway}&rsquo;</span></h1>
          <p className="mt-3 text-2xl font-bold">
            {rwf(p.price)} {p.wasPrice && <s className="ml-2 text-lg font-normal text-muted">{rwf(p.wasPrice)}</s>}
          </p>
          <p className="mt-4 max-w-md text-ink/75">{p.blurb}</p>

          <div className="mt-8 flex items-center gap-3">
            <p className="font-bold">Size</p>
            <div className="flex border border-ink text-xs font-bold" role="radiogroup" aria-label="Size system">
              {(["EU", "US", "UK"] as System[]).map((s) => (
                <button key={s} role="radio" aria-checked={sys === s} onClick={() => setSys(s)} className={`px-2.5 py-1 ${sys === s ? "bg-ink text-paper" : ""}`}>{s}</button>
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
                  aria-label={`${sys} ${label(s)}${n ? "" : ", sold out"}`}
                  className={`relative border-2 py-3 text-center font-bold transition-colors disabled:cursor-not-allowed disabled:border-line disabled:text-line disabled:[background:linear-gradient(to_top_right,transparent_calc(50%-1px),var(--color-line),transparent_calc(50%+1px))]
                    ${on ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}>
                  {label(s)}
                  {n === 1 && !on && <span className="absolute -right-1.5 -top-1.5 size-3 rounded-full bg-sun ring-2 ring-paper" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          <p className="mt-2 h-5 text-sm" aria-live="polite">
            {nudge && !size ? <span className="font-semibold text-red-700">Pick your size first.</span>
              : size ? (left === 1 ? <span className="font-semibold">Last pair in {sys} {label(size)}.</span> : <span className="text-muted">{left} pairs in {sys} {label(size)}.</span>)
              : <span className="text-muted">Yellow dot means one pair left.</span>}
          </p>

          {out ? (
            <a href={waLink(`Hi KGL Kicks! Please let me know when ${name(p)} is back. My size is EU `)} target="_blank" rel="noopener"
              className="mt-4 block rounded-full bg-ink py-4 text-center font-bold text-paper">Tell me when it&apos;s back</a>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button onClick={add} className="rounded-full bg-ink py-4 font-bold text-paper hover:bg-ink/85">Add to bag</button>
              <a href={size ? waLink(`Hi KGL Kicks! I'd like the ${name(p)} in EU ${size} (${rwf(p.price)}). Is it available today?`) : undefined}
                onClick={(e) => { if (!size) { e.preventDefault(); setNudge(true); } }} target="_blank" rel="noopener"
                className="rounded-full bg-[#1fa855] py-4 text-center font-bold text-paper hover:brightness-95">Order on WhatsApp</a>
            </div>
          )}

          <ul className="mt-6 space-y-2 text-sm">
            <li><span className="font-bold">Delivery:</span> same day in Kigali if you order before 3pm, from 1,500 RWF.</li>
            <li><span className="font-bold">Payment:</span> MoMo or cash. Try them on before you pay.</li>
            <li><span className="font-bold">Authentic:</span> checked by hand. Not real? Full refund.</li>
          </ul>

          <BoxLabel styleCode={p.styleCode} model={p.model} colorway={p.colorway} size={size ? `EU ${size}` : "Pick a size"} />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="wide text-3xl">You might also like</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((r) => <ProductCard key={r.slug} p={r} />)}
          </div>
        </section>
      )}

      {guide && <SizeGuide onClose={() => setGuide(false)} />}
    </main>
  );
}

/** The detail people check on a real box: style code and size. */
function BoxLabel({ styleCode, model, colorway, size }: { styleCode: string; model: string; colorway: string; size: string }) {
  const bars = Array.from(styleCode.replace(/\W/g, "") + "KGLKICKS").map((c) => (c.charCodeAt(0) % 4) + 1);
  return (
    <div className="mt-8 border-2 border-ink">
      <div className="flex items-center justify-between border-b-2 border-ink bg-concrete px-4 py-2 text-xs font-bold">
        <span>On the box</span><span>{size}</span>
      </div>
      <div className="flex items-end gap-4 p-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{model}</p>
          <p className="truncate text-sm text-muted">{colorway}</p>
          <p className="wide mt-1 text-xl">{styleCode}</p>
        </div>
        <div className="flex h-12 items-stretch gap-[2px]" aria-hidden="true">
          {bars.map((w, i) => <span key={i} className="bg-ink" style={{ width: w }} />)}
        </div>
      </div>
      <p className="border-t border-line px-4 py-2 text-xs text-muted">Match this style code with the tag inside the shoe when it arrives.</p>
    </div>
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
      <div className="fade-in absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="fade-in relative w-full max-w-md border-2 border-ink bg-paper p-6 shadow-[8px_8px_0_#000]">
        <button onClick={onClose} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border-2 border-ink font-bold" aria-label="Close size guide" autoFocus>×</button>
        <h2 className="wide text-2xl">Size guide</h2>
        <p className="mt-1 text-sm text-muted">Men&apos;s sizes. Measure your foot heel to big toe and pick the closest length.</p>
        <table className="mt-4 w-full text-center text-sm">
          <thead><tr className="border-b-2 border-ink">{["EU", "US", "UK", "Foot (cm)"].map((h) => <th key={h} className="py-2">{h}</th>)}</tr></thead>
          <tbody>
            {SIZES.map((s) => (
              <tr key={s} className="border-b border-line"><td className="py-1.5 font-bold">{s}</td>{SIZE_CHART[s].map((v, i) => <td key={i}>{v}</td>)}</tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm">Between sizes? Jordans and Dunks run true. Go half a size down in Sambas.</p>
      </div>
    </div>
  );
}
