import Link from "next/link";
import { STORE, waLink } from "@/lib/data";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-line bg-concrete text-ink">
      <div className="absolute -top-40 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-kgl/10 blur-[120px]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-4 pt-16 sm:px-6">
        {/* call to action */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-line pb-12 md:flex-row md:items-end">
          <h2 className="wide max-w-xl text-4xl leading-[0.95] sm:text-6xl">Your next pair is one message away.</h2>
          <a href={waLink("Hi KGL Kicks! I'd like to order a pair.")} target="_blank" rel="noopener"
            className="group inline-flex shrink-0 items-center gap-3 rounded-full bg-kgl py-2 pl-7 pr-2 font-bold text-white transition hover:bg-kgl-deep">
            Chat on WhatsApp
            <span className="grid size-10 place-items-center rounded-full bg-black/25 transition group-hover:translate-x-1" aria-hidden="true">→</span>
          </a>
        </div>

        <div className="grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Wordmark className="text-3xl" />
            <p className="mt-4 max-w-xs text-ink/60">Rwanda&apos;s #1 sneaker store. Free delivery in Kigali, worldwide with DHL Express.</p>
          </div>
          <div className="text-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Shop</p>
            <ul className="mt-4 space-y-2.5 text-ink/75">
              <li><Link href="/shop" className="hover:text-kgl">All sneakers</Link></li>
              <li><Link href="/shop?brand=Nike" className="hover:text-kgl">Nike</Link></li>
              <li><Link href="/shop?brand=New+Balance" className="hover:text-kgl">New Balance</Link></li>
              <li><Link href="/shop?brand=Adidas" className="hover:text-kgl">Adidas</Link></li>
              <li><Link href="/#request" className="hover:text-kgl">Request a pair</Link></li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted">Talk to us</p>
            <ul className="mt-4 space-y-2.5 text-ink/75">
              <li><a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener" className="hover:text-kgl">WhatsApp {STORE.phoneDisplay}</a></li>
              <li><a href={STORE.instagram} target="_blank" rel="noopener" className="hover:text-kgl">Instagram @kigali_kicks_</a></li>
              {STORE.mapsUrl && <li><a href={STORE.mapsUrl} target="_blank" rel="noopener" className="hover:text-kgl">Store on Google Maps</a></li>}
              <li>{STORE.area}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* giant wordmark bleeding off the bottom */}
      <p className="wide outline-text relative -mb-[3vw] select-none whitespace-nowrap text-center text-[17vw] leading-none" aria-hidden="true">KGL KICKS</p>
      <div className="relative flex h-2" aria-hidden="true"><span className="flex-[2] bg-sky" /><span className="flex-1 bg-sun" /><span className="flex-1 bg-leaf" /></div>
    </footer>
  );
}
