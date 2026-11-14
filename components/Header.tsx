"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { setBagOpen, useBag } from "@/lib/bag";
import { Wordmark } from "./Wordmark";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="bg-kgl px-4 py-1.5 text-center text-xs font-semibold text-white">
        Free delivery in Kigali. Free socks with every pair.
      </div>
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" aria-label="KGL Kicks home"><Wordmark /></Link>
        <Suspense fallback={<nav className="ml-8 hidden md:block" />}><Nav /></Suspense>
        <BagButton />
      </div>
      <Suspense fallback={null}><Nav mobile /></Suspense>
    </header>
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
      className={mobile ? "flex gap-5 overflow-x-auto border-t border-line px-4 py-2 text-sm font-semibold [scrollbar-width:none] md:hidden" : "ml-8 hidden gap-6 text-sm font-semibold md:flex"}>
      {items.map(([href, label, on]) => (
        <Link key={href} href={href} aria-current={on ? "page" : undefined}
          className={`shrink-0 border-b-2 py-1 ${on ? "border-kgl text-ink" : "border-transparent text-ink/70 hover:text-ink"}`}>{label}</Link>
      ))}
    </nav>
  );
}

function BagButton() {
  const bag = useBag();
  const n = bag.reduce((s, l) => s + l.qty, 0);
  return (
    <button onClick={() => setBagOpen(true)} aria-label={`Open bag, ${n} ${n === 1 ? "pair" : "pairs"}`}
      className="ml-auto flex items-center gap-2 rounded-full border border-line bg-concrete px-4 py-2 text-sm font-bold hover:border-ink">
      Bag
      <span key={n} className={`grid min-w-6 place-items-center rounded-full px-1.5 text-xs ${n ? "tick bg-kgl text-white" : "bg-raised text-muted"}`}>{n}</span>
    </button>
  );
}
