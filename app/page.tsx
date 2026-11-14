import Link from "next/link";
import { PRODUCTS, SCENES, SIZES, STORE, bySlug, img, rwf } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { DropCountdown } from "@/components/DropCountdown";
import { RequestForm } from "@/components/RequestForm";

export default function Home() {
  const hero = bySlug("jordan-1-high-chicago")!;
  const latest = [...PRODUCTS].sort((a, b) => a.addedDaysAgo - b.addedDaysAgo).slice(0, 8);
  const perSize = SIZES.map((s) => [s, PRODUCTS.filter((p) => (p.stock[s] ?? 0) > 0).length] as const);
  const brands = [
    { b: "Jordan", photo: "1610897600804-c36e2336ad3a" },
    { b: "Nike", photo: "1623684225794-a8f1f5037f5c" },
    { b: "Adidas", photo: "1718220095476-7916e897fc55" },
  ];

  return (
    <main>
      {/* hero */}
      <section className="border-b border-ink bg-concrete">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_1.1fr] md:py-16">
          <div>
            <h1 className="wide text-[clamp(2.6rem,7vw,5.6rem)] leading-[0.92]">Real kicks. At your door today.</h1>
            <p className="mt-6 max-w-md text-lg text-ink/75">
              Authentic Jordans, Nike and Adidas, checked by hand in Kigali. See exactly which sizes we have, order on WhatsApp, pay with MoMo.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="rounded-full bg-ink px-7 py-3.5 font-bold text-paper hover:bg-ink/85">Shop sneakers</Link>
              <a href="#request" className="rounded-full border-2 border-ink px-7 py-3 font-bold hover:bg-paper">Request a pair</a>
            </div>
          </div>
          <Link href={`/shop/${hero.slug}`} className="group relative block">
            <img src={img(SCENES.hero, 1200, 1000)} alt="Air Jordan 1 High in red, white and black" fetchPriority="high"
              className="aspect-[6/5] w-full object-cover" />
            {/* shoebox-style label */}
            <div className="absolute -bottom-5 left-4 right-4 flex items-stretch border-2 border-ink bg-paper shadow-[6px_6px_0_#000] sm:left-auto sm:w-96">
              <div className="flex-1 p-3">
                <p className="text-xs font-semibold text-muted">{hero.styleCode}</p>
                <p className="semiwide leading-tight group-hover:underline">{hero.model} &lsquo;{hero.colorway}&rsquo;</p>
                <p className="mt-1 text-sm">EU {Object.keys(hero.stock).join(", ")} left</p>
              </div>
              <div className="grid place-items-center border-l-2 border-ink bg-sun px-4">
                <p className="wide text-lg leading-none">{rwf(hero.price).replace(" RWF", "")}<span className="block text-xs font-bold">RWF</span></p>
              </div>
            </div>
          </Link>
        </div>
      </section>

      <DropCountdown />

      {/* latest */}
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="wide text-3xl sm:text-4xl">Just landed</h2>
          <Link href="/shop" className="font-bold underline underline-offset-4">Shop all {PRODUCTS.length}</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {latest.map((p, i) => <ProductCard key={p.slug} p={p} eager={i < 4} />)}
        </div>
      </section>

      {/* by size */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <h2 className="wide text-3xl sm:text-4xl">Shop your size</h2>
        <p className="mt-2 text-muted">Skip the &ldquo;do you have 42?&rdquo; messages. Tap your size to see only what fits.</p>
        <ul className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-9">
          {perSize.map(([s, n]) => (
            <li key={s}>
              <Link href={`/shop?size=${s}`} className="block border-2 border-ink p-3 text-center hover:bg-ink hover:text-paper">
                <span className="block text-xs font-semibold opacity-70">EU</span>
                <span className="wide block text-3xl leading-none">{s}</span>
                <span className="mt-1 block text-xs opacity-70">{n} {n === 1 ? "model" : "models"}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* brands */}
      <section className="mx-auto mt-20 grid max-w-7xl gap-4 px-4 sm:grid-cols-3 sm:px-6">
        {brands.map(({ b, photo }) => (
          <Link key={b} href={`/shop?brand=${b}`} className="group relative block overflow-hidden bg-ink">
            <img src={img(photo, 800, 900)} alt="" loading="lazy" className="aspect-[8/9] w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-60" />
            <span className="wide absolute bottom-4 left-4 text-4xl text-paper">{b}</span>
            <span className="absolute bottom-5 right-4 text-sm font-bold text-paper">{PRODUCTS.filter((p) => p.brand === b).length} models</span>
          </Link>
        ))}
      </section>

      {/* how it works: a real sequence, so it's numbered */}
      <section className="mt-20 border-y border-ink bg-sun">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="wide text-3xl sm:text-4xl">How ordering works</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              ["Pick your pair and size", "Every size you see is a pair we're holding. No guessing, no back-and-forth."],
              ["Confirm on WhatsApp", "Your bag becomes a WhatsApp message. We confirm in minutes and send a MoMo code if you want to pay upfront."],
              ["Wear them today", "Order before 3pm and we deliver anywhere in Kigali the same day. Try them on before you pay if you chose MoMo on delivery."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="wide grid size-12 shrink-0 place-items-center rounded-full bg-ink text-xl text-sun">{i + 1}</span>
                <div><p className="semiwide text-lg">{t}</p><p className="mt-1 text-ink/75">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* authenticity */}
      <section className="mx-auto mt-20 grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
        <img src={img(SCENES.wall, 1100, 900)} alt="A wall of sneakers on display" loading="lazy" className="aspect-[11/9] w-full object-cover" />
        <div>
          <h2 className="wide text-3xl sm:text-4xl">Real, or your money back.</h2>
          <p className="mt-4 max-w-md text-lg text-ink/75">Fakes are everywhere. Every pair we sell gets checked before it reaches you:</p>
          <ul className="mt-6 space-y-3">
            {["Style code on the box matches the tag inside the shoe", "Stitching, shape and materials checked against retail pairs", "Original box and paper, no swaps", "If it's not authentic, you get every franc back"].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-leaf text-xs font-bold text-paper" aria-hidden="true">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* request */}
      <section id="request" className="mx-auto mt-20 max-w-7xl scroll-mt-28 px-4 sm:px-6">
        <div className="grid gap-10 border-2 border-ink p-6 sm:p-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="wide text-3xl sm:text-4xl">Can&apos;t find your pair?</h2>
            <p className="mt-4 max-w-sm text-lg text-ink/75">Tell us the model and size. We source it, send you a price, and only order once you say yes.</p>
            <a href={STORE.instagram} target="_blank" rel="noopener" className="mt-6 inline-block font-bold underline underline-offset-4">See new drops first on Instagram</a>
          </div>
          <RequestForm />
        </div>
      </section>
    </main>
  );
}
