"use client";

import { useEffect, useState } from "react";
import { bySlug, img, name } from "@/lib/data";
import { setBagOpen } from "@/lib/bag";

export function AddedToast() {
  const [item, setItem] = useState<{ slug: string; size: number; k: number } | null>(null);
  useEffect(() => {
    const on = (e: Event) => setItem({ ...(e as CustomEvent).detail, k: Date.now() });
    window.addEventListener("kglkicks:added", on);
    return () => window.removeEventListener("kglkicks:added", on);
  }, []);
  useEffect(() => { if (!item) return; const t = setTimeout(() => setItem(null), 3500); return () => clearTimeout(t); }, [item]);
  const p = item && bySlug(item.slug);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4">
      {p && item && (
        <div key={item.k} className="toast-in pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-2xl border border-line bg-concrete p-2 pr-3 shadow-2xl shadow-black/60">
          <img src={img(p.photos[0])} alt="" className="shot size-12 rounded-xl object-cover" />
          <p className="min-w-0 flex-1 text-sm"><span className="font-bold">Added to bag.</span> <span className="text-muted">{name(p)}, EU {item.size}</span></p>
          <button onClick={() => { setBagOpen(true); setItem(null); }} className="shrink-0 rounded-full bg-kgl px-4 py-2 text-sm font-bold text-white">View bag</button>
        </div>
      )}
    </div>
  );
}
