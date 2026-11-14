"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DROP, bySlug, img, nextDrop, waLink } from "@/lib/data";

export function DropCountdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const t0 = setTimeout(() => setNow(Date.now()), 0);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { clearTimeout(t0); clearInterval(t); };
  }, []);
  const p = bySlug(DROP.slug)!;
  const target = now ? nextDrop(now) : null;
  const left = target && now ? Math.max(0, target - now) : 0;
  const parts = [
    ["days", Math.floor(left / 86400000)],
    ["hrs", Math.floor(left / 3600000) % 24],
    ["min", Math.floor(left / 60000) % 60],
    ["sec", Math.floor(left / 1000) % 60],
  ] as const;
  const when = target ? new Date(target).toLocaleString("en-GB", { weekday: "long", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Kigali" }) : "";

  return (
    <section aria-labelledby="drop-h" className="border-b border-ink bg-sky text-paper">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-8 sm:px-6 md:grid-cols-[auto_1fr_auto]">
        <img src={img(p.photos[0], 260, 260)} alt="" className="hidden size-28 border-2 border-ink object-cover md:block" />
        <div>
          <p className="font-semibold text-paper/85">Next drop{when ? `, ${when}` : ""}</p>
          <h2 id="drop-h" className="wide text-2xl leading-tight sm:text-3xl">
            <Link href={`/shop/${p.slug}`} className="hover:underline">{DROP.name}</Link>
          </h2>
          <p className="text-paper/85">{DROP.note}. First come, first served.</p>
        </div>
        <div>
          <div className="flex gap-2" role="timer" aria-label={target ? `Drop starts ${when}` : "Drop countdown"}>
            {parts.map(([label, v]) => (
              <div key={label} className="w-16 border-2 border-ink bg-paper py-2 text-center text-ink">
                <span key={v} className="wide tick block text-2xl leading-none">{now ? String(v).padStart(2, "0") : "--"}</span>
                <span className="text-xs font-semibold text-muted">{label}</span>
              </div>
            ))}
          </div>
          <a href={waLink(`Hi KGL Kicks! Please remind me before the ${DROP.name} drop. My size is EU `)} target="_blank" rel="noopener"
            className="mt-3 block text-center text-sm font-bold underline underline-offset-4">Remind me on WhatsApp</a>
        </div>
      </div>
    </section>
  );
}
