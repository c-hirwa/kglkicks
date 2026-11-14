"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { setBagOpen, useBag } from "@/lib/bag";
import { Wordmark } from "./Wordmark";

export function Header() {
  return (
    <>
      <div className="bg-kgl px-4 py-2 text-center text-xs font-bold tracking-wide text-white">
        Free delivery in Kigali <span className="mx-2 opacity-60" aria-hidden="true">✦</span> Free socks with every pair
      </div>
      <header className="sticky top-0 z-40 px-3 pt-3 sm:px-6">
        <div className="mx-auto max-w-7xl rounded-[1.75rem] border border-white/10 bg-paper/70 shadow-[0_10px_40px_-15px_rgb(0_0_0/.8)] backdrop-blur-xl">
          <div className="flex h-16 items-center gap-4 pl-5 pr-2.5">
            <Link href="/" aria-label="KGL Kicks home"><Wordmark /></Link>
            <Suspense fallback={<nav className="mx-auto hidden md:block" />}><Nav /></Suspense>
            <BagButton />
          </div>
          <Suspense fallback={null}><Nav mobile /></Suspense>
        </div>
      </header>
    </>
  );
}

function Nav({ mobile = false }: { mobile?: boolean }) {
  const path = usePathname();
  const brand = useSearchParams().get("brand");
  const items: [string, string, boolean][] = [
    ["/shop", "Shop all", path === "/shop" && !brand],
    ["/shop?brand=Nike", "Nike", brand === "Nike"],
    ["/shop?brand=New+Balance", "New Balance", brand === "New Balance"],
    ["/shop?brand=Adidas", "Adidas", brand === "Adidas"],
    ["/#request", "Request a pair", false],
  ];
  return (
    <nav aria-label={mobile ? "Main, mobile" : "Main"}
      className={mobile ? "flex gap-1 overflow-x-auto border-t border-white/10 px-2 py-2 text-sm font-semibold [scrollbar-width:none] md:hidden" : "mx-auto hidden gap-1 text-sm font-semibold md:flex"}>
      {items.map(([href, label, on]) => (
        <Link key={href} href={href} aria-current={on ? "page" : undefined}
          className={`shrink-0 rounded-full px-4 py-2 transition ${on ? "bg-white/10 text-ink" : "text-ink/65 hover:bg-white/5 hover:text-ink"}`}>{label}</Link>
      ))}
    </nav>
  );
}

function BagButton() {
  const bag = useBag();
  const n = bag.reduce((s, l) => s + l.qty, 0);
  return (
    <button onClick={() => setBagOpen(true)} aria-label={`Open bag, ${n} ${n === 1 ? "pair" : "pairs"}`}
      className="ml-auto flex items-center gap-2 rounded-full bg-ink py-2 pl-5 pr-2 text-sm font-bold text-paper transition hover:bg-kgl hover:text-white md:ml-0">
      Bag
      <span key={n} className={`grid size-7 place-items-center rounded-full text-xs ${n ? "tick bg-kgl text-white" : "bg-black/15"}`}>{n}</span>
    </button>
  );
}
