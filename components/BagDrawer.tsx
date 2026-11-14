"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DELIVERY, bySlug, img, name, rwf, waLink } from "@/lib/data";
import { clearBag, setBagOpen, setQty, useBag, useBagOpen } from "@/lib/bag";

export function BagDrawer() {
  const open = useBagOpen();
  const bag = useBag();
  const [zone, setZone] = useState(DELIVERY[1].id);
  const [pay, setPay] = useState("MoMo on delivery");
  const [who, setWho] = useState("");

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setBagOpen(false);
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;
  const lines = bag.map((l) => ({ ...l, p: bySlug(l.slug)! }));
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  const d = DELIVERY.find((x) => x.id === zone)!;
  const total = subtotal + d.fee;

  function send() {
    const text = [
      `Hi KGL Kicks! I'd like to order${who.trim() ? ` (${who.trim()})` : ""}:`,
      "",
      ...lines.map((l) => `• ${name(l.p)}, EU ${l.size}${l.qty > 1 ? ` ×${l.qty}` : ""}: ${rwf(l.p.price * l.qty)}`),
      "",
      `${d.label}${d.fee ? ` (+${rwf(d.fee)})` : ""}`,
      `Payment: ${pay}`,
      `Total: ${rwf(total)}`,
      "",
      "Are these sizes still available?",
    ].join("\n");
    window.open(waLink(text), "_blank", "noopener");
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your bag">
      <div className="fade-in absolute inset-0 bg-ink/50" onClick={() => setBagOpen(false)} />
      <div className="drawer-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper">
        <div className="flex items-center border-b border-ink px-5 py-4">
          <h2 className="wide text-2xl">Your bag</h2>
          <button onClick={() => setBagOpen(false)} className="ml-auto grid size-10 place-items-center rounded-full border-2 border-ink text-xl font-bold hover:bg-ink hover:text-paper" aria-label="Close bag" autoFocus>×</button>
        </div>

        {lines.length === 0 ? (
          <div className="grid flex-1 place-items-center p-8 text-center">
            <div>
              <p className="semiwide text-xl">Nothing in here yet.</p>
              <p className="mt-1 text-muted">Pick a pair, choose your size, and it lands here.</p>
              <Link href="/shop" onClick={() => setBagOpen(false)} className="mt-6 inline-block rounded-full bg-ink px-6 py-3 font-bold text-paper">Shop sneakers</Link>
            </div>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((l) => {
                const max = l.p.stock[l.size] ?? 0;
                return (
                  <li key={`${l.slug}-${l.size}`} className="flex gap-4 py-4">
                    <img src={img(l.p.photos[0], 200, 200)} alt="" className="size-20 shrink-0 bg-concrete object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold leading-snug">{name(l.p)}</p>
                      <p className="text-sm text-muted">EU {l.size}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <div className="flex items-center border border-ink text-sm font-bold">
                          <button onClick={() => setQty(l.slug, l.size, l.qty - 1)} className="grid size-8 place-items-center" aria-label="One less">−</button>
                          <span className="w-6 text-center">{l.qty}</span>
                          <button onClick={() => setQty(l.slug, l.size, Math.min(max, l.qty + 1))} disabled={l.qty >= max} className="grid size-8 place-items-center disabled:text-line" aria-label="One more">+</button>
                        </div>
                        {l.qty >= max && <span className="text-xs text-muted">That&apos;s all we have in EU {l.size}</span>}
                      </div>
                    </div>
                    <p className="font-bold">{rwf(l.p.price * l.qty)}</p>
                  </li>
                );
              })}
            </ul>
            <div className="space-y-3 border-t border-ink bg-concrete px-5 py-5">
              <label className="block text-sm font-semibold">Delivery
                <select value={zone} onChange={(e) => setZone(e.target.value)} className="mt-1 w-full border border-ink bg-paper px-3 py-2.5">
                  {DELIVERY.map((x) => <option key={x.id} value={x.id}>{x.label}{x.fee ? `, ${rwf(x.fee)}` : ", free"}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block text-sm font-semibold">Pay with
                  <select value={pay} onChange={(e) => setPay(e.target.value)} className="mt-1 w-full border border-ink bg-paper px-3 py-2.5">
                    <option>MoMo on delivery</option><option>MoMo now</option><option>Cash on delivery</option>
                  </select>
                </label>
                <label className="block text-sm font-semibold">Your name
                  <input value={who} onChange={(e) => setWho(e.target.value)} autoComplete="name" className="mt-1 w-full border border-ink bg-paper px-3 py-2.5" />
                </label>
              </div>
              <div className="flex items-end justify-between pt-1">
                <div className="text-sm text-muted"><p>Shoes {rwf(subtotal)}</p><p>{d.fee ? `Delivery ${rwf(d.fee)}` : "Pick up, free"}</p></div>
                <p className="wide text-2xl">{rwf(total)}</p>
              </div>
              <button onClick={send} className="w-full rounded-full bg-[#1fa855] py-4 font-bold text-paper hover:brightness-95">Order on WhatsApp</button>
              <div className="flex justify-between text-xs text-muted">
                <span>We confirm sizes and send a MoMo code.</span>
                <button onClick={clearBag} className="font-semibold underline">Empty bag</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
