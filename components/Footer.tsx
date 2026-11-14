import Link from "next/link";
import { STORE } from "@/lib/data";
import { Wordmark } from "./Wordmark";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-concrete text-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Wordmark className="text-3xl" />
          <p className="mt-4 max-w-xs text-ink/60">Rwanda&apos;s sneaker store. Free delivery in Kigali, worldwide with DHL Express.</p>
        </div>
        <div className="text-sm">
          <p className="font-bold">Shop</p>
          <ul className="mt-2 space-y-1.5 text-ink/60">
            <li><Link href="/shop?brand=Nike" className="hover:text-kgl">Nike</Link></li>
            <li><Link href="/shop?brand=New+Balance" className="hover:text-kgl">New Balance</Link></li>
            <li><Link href="/shop?brand=Adidas" className="hover:text-kgl">Adidas</Link></li>
            <li><Link href="/#request" className="hover:text-kgl">Request a pair</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-bold">Talk to us</p>
          <ul className="mt-2 space-y-1.5 text-ink/60">
            <li><a href={`https://wa.me/${STORE.whatsapp}`} target="_blank" rel="noopener" className="hover:text-kgl">WhatsApp {STORE.phoneDisplay}</a></li>
            <li><a href={STORE.instagram} target="_blank" rel="noopener" className="hover:text-kgl">Instagram @kigali_kicks_</a></li>
            <li>{STORE.area}</li>
          </ul>
        </div>
      </div>
      <div className="flex h-3" aria-hidden="true"><span className="flex-[2] bg-sky" /><span className="flex-1 bg-sun" /><span className="flex-1 bg-leaf" /></div>
    </footer>
  );
}
