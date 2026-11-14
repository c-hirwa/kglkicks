import Link from "next/link";
import { BRANDS, PRODUCTS, SIZES, STORE, bySlug, fromPrice, img, rwf, waLink } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { RequestForm } from "@/components/RequestForm";

export default function Home() {
  const hero = bySlug("new-balance-990v4-grey")!;
  const latest = [...PRODUCTS].sort((a, b) => a.order - b.order).slice(0, 8);
  const perSize = SIZES.map((s) => [s, PRODUCTS.filter((p) => (p.stock[s] ?? 0) > 0).length] as const);
  const brands = BRANDS.map((b) => ({ b, n: PRODUCTS.filter((p) => p.brand === b).length, p: PRODUCTS.find((p) => p.brand === b)! }));
  const perks = [
    ["Free delivery", "Anywhere in Kigali"],
    ["Free socks", "With every pair"],
    ["Worldwide", "Shipped with DHL Express"],
    [`${STORE.followers}+`, "Followers on Instagram"],
  ];

  return (
    <main>
      {/* hero */}
      <section className="grain relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.05fr_1fr] md:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-kgl/40 bg-kgl/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-kgl">
              <span className="size-1.5 rounded-full bg-kgl" aria-hidden="true" /> New stock just landed
            </p>
            <h1 className="wide mt-5 text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.92]">Rwanda&apos;s sneaker store.</h1>
            <p className="mt-6 max-w-md text-lg text-ink/70">
              Nike, New Balance, Adidas, On and more from <span className="font-bold text-ink">{rwf(fromPrice)}</span>.
              Order on WhatsApp, get free delivery in Kigali and free socks with every pair.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="rounded-full bg-kgl px-7 py-3.5 font-bold text-white hover:bg-kgl-deep">Shop new stock</Link>
              <a href={waLink("Hi KGL Kicks! I'd like to order a pair.")} target="_blank" rel="noopener"
                className="rounded-full border-2 border-ink/80 px-7 py-3 font-bold hover:bg-ink hover:text-paper">Order on WhatsApp</a>
            </div>
          </div>

          <div className="relative">
            <Link href={`/shop/${hero.slug}`} className="group relative block">
              <div className="shot overflow-hidden rounded-3xl">
                <img src={img(hero.photos[0])} alt={`${hero.brand} ${hero.model} in ${hero.colorway}`} fetchPriority="high"
                  className="aspect-square w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
              </div>
              <div className="absolute -bottom-5 left-4 right-4 flex items-stretch overflow-hidden rounded-2xl border border-line bg-concrete/95 shadow-2xl shadow-black/60 backdrop-blur sm:left-auto sm:w-96">
                <div className="flex-1 p-3.5">
                  <p className="text-xs font-semibold text-muted">{hero.brand}</p>
                  <p className="semiwide leading-tight group-hover:underline">{hero.model} &lsquo;{hero.colorway}&rsquo;</p>
                  <p className="mt-1 text-sm text-muted">EU {Object.keys(hero.stock)[0]} to {Object.keys(hero.stock).at(-1)}</p>
                </div>
                <div className="grid place-items-center bg-kgl px-4 text-white">
                  <p className="wide text-lg leading-none">{rwf(hero.price).replace(" RWF", "")}<span className="block text-xs font-bold">RWF</span></p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* perks: what their posts promise */}
      <section aria-label="Why order from us" className="border-b border-line bg-concrete">
        <ul className="mx-auto grid max-w-7xl grid-cols-2 divide-line px-4 sm:px-6 md:grid-cols-4 md:divide-x">
          {perks.map(([t, d]) => (
            <li key={t} className="py-5 md:px-6 md:first:pl-0">
              <p className="semiwide text-lg text-kgl">{t}</p>
              <p className="text-sm text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* latest */}
      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="wide text-3xl sm:text-4xl">New stock</h2>
          <Link href="/shop" className="font-bold text-kgl underline-offset-4 hover:underline">Shop all {PRODUCTS.length}</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
          {latest.map((p, i) => <ProductCard key={p.slug} p={p} eager={i < 4} />)}
        </div>
      </section>

      {/* by size */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <h2 className="wide text-3xl sm:text-4xl">Shop your size</h2>
        <p className="mt-2 text-muted">Skip the &ldquo;do you have 42?&rdquo; messages. Tap your size to see only what fits.</p>
        <ul className="mt-6 grid grid-cols-5 gap-2 lg:grid-cols-10">
          {perSize.map(([s, n]) => (
            <li key={s}>
              <Link href={`/shop?size=${s}`} className="block rounded-xl border border-line bg-concrete p-3 text-center transition-colors hover:border-kgl hover:bg-kgl hover:text-white">
                <span className="block text-xs font-semibold opacity-60">EU</span>
                <span className="wide block text-2xl leading-none sm:text-3xl">{s}</span>
                <span className="mt-1 block text-xs opacity-60">{n} {n === 1 ? "model" : "models"}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* brands */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        <h2 className="wide text-3xl sm:text-4xl">Shop by brand</h2>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map(({ b, n, p }) => (
            <li key={b}>
              <Link href={`/shop?brand=${encodeURIComponent(b)}`} className="group block overflow-hidden rounded-2xl border border-line bg-concrete hover:border-kgl">
                <div className="shot overflow-hidden">
                  <img src={img(p.photos[0])} alt="" loading="lazy" className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="flex items-baseline justify-between gap-2 p-3">
                  <span className="semiwide">{b}</span>
                  <span className="text-xs text-muted">{n} {n === 1 ? "model" : "models"}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* how it works: a real sequence, so it's numbered */}
      <section className="mt-20 border-y border-line bg-concrete">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <h2 className="wide text-3xl sm:text-4xl">How ordering works</h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              ["Pick your pair and size", "Every size you can tap is in our store in Kigali."],
              ["Order on WhatsApp", "Your bag becomes a ready-written WhatsApp message. We confirm your size and how you'd like to pay."],
              ["Free delivery in Kigali", "We bring them to your door at no cost, with free socks. Outside Kigali or abroad, we ship with DHL Express."],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="wide grid size-12 shrink-0 place-items-center rounded-full bg-kgl text-xl text-white">{i + 1}</span>
                <div><p className="semiwide text-lg">{t}</p><p className="mt-1 text-ink/65">{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* the store */}
      <section className="mx-auto mt-20 grid max-w-7xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2">
        <div className="grid grid-cols-[1.2fr_1fr] gap-3">
          <img src="/store/inside.jpg" alt="Inside the KGL Kicks store: walls of sneakers and leather seats" loading="lazy" className="aspect-[3/4] w-full rounded-2xl object-cover" />
          <img src="/store/outside.jpg" alt="The KGL Kicks store building from outside" loading="lazy" className="mt-10 aspect-[3/4] w-full rounded-2xl object-cover" />
        </div>
        <div>
          <h2 className="wide text-3xl sm:text-4xl">Come try them on.</h2>
          <p className="mt-4 max-w-md text-lg text-ink/70">Our store in Kigali has walls full of pairs. Drop by to try your size, or message us and we&apos;ll bring them to you.</p>
          <ul className="mt-6 space-y-3">
            {["Every pair on this site is in the store", "Free delivery anywhere in Kigali", "Free socks with every pair", "Worldwide shipping with DHL Express"].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-kgl text-xs font-bold text-white" aria-hidden="true">✓</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <a href={waLink("Hi KGL Kicks! Where is your store? I'd like to visit.")} target="_blank" rel="noopener"
            className="mt-8 inline-block rounded-full border-2 border-ink/80 px-6 py-3 font-bold hover:bg-ink hover:text-paper">Get directions on WhatsApp</a>
        </div>
      </section>

      {/* request */}
      <section id="request" className="mx-auto mt-20 max-w-7xl scroll-mt-28 px-4 sm:px-6">
        <div className="grain grid gap-10 rounded-3xl border border-line bg-concrete p-6 sm:p-10 md:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 className="wide text-3xl sm:text-4xl">Can&apos;t find your pair?</h2>
            <p className="mt-4 max-w-sm text-lg text-ink/70">Tell us the model and size. We&apos;ll find it and send you a price before you commit.</p>
            <a href={STORE.instagram} target="_blank" rel="noopener" className="mt-6 inline-block font-bold text-kgl underline-offset-4 hover:underline">See new stock first on Instagram</a>
          </div>
          <RequestForm />
        </div>
      </section>
    </main>
  );
}
