import Link from "next/link";
import { BRANDS, PRODUCTS, SIZES, STORE, bySlug, fromPrice, img, rwf, waLink } from "@/lib/data";
import { ProductCard } from "@/components/ProductCard";
import { RequestForm } from "@/components/RequestForm";

function Kicker({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-kgl">
      <span className="text-muted">{n}</span><span className="h-px w-8 bg-kgl/60" aria-hidden="true" />{children}
    </p>
  );
}

const TICKER = ["New stock", "Free delivery in Kigali", "Free socks with every pair", "DHL worldwide", "Nike", "New Balance", "Adidas", "On", "Puma", "Birkenstock"];

export default function Home() {
  const latest = [...PRODUCTS].sort((a, b) => a.order - b.order);
  const perSize = SIZES.map((s) => [s, PRODUCTS.filter((p) => (p.stock[s] ?? 0) > 0).length] as const);
  const brands = BRANDS.map((b) => ({ b, n: PRODUCTS.filter((p) => p.brand === b).length, p: PRODUCTS.find((p) => p.brand === b)! }));
  const samba = bySlug("adidas-samba-maroon")!;
  const metcon = bySlug("nike-free-metcon-7-triple-black")!;
  const boston = bySlug("birkenstock-boston-taupe-haze")!;

  return (
    <main className="overflow-x-clip">
      {/* ───────── hero ───────── */}
      <section className="relative isolate overflow-hidden">
        <div className="gridlines absolute inset-0 -z-10" aria-hidden="true" />
        <div className="absolute -top-40 left-1/2 -z-10 size-[60rem] -translate-x-1/2 rounded-full bg-kgl/20 blur-[140px]" aria-hidden="true" />
        <p className="wide outline-text pointer-events-none absolute -bottom-6 left-0 right-0 -z-10 select-none whitespace-nowrap text-center text-[19vw] leading-none" aria-hidden="true">KIGALI</p>

        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 pb-16 pt-10 sm:px-6 md:grid-cols-[1fr_1.05fr] md:pb-24 md:pt-16">
          <div className="relative z-10">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 py-1.5 pl-2 pr-4 text-xs font-bold uppercase tracking-wider backdrop-blur">
              <span className="pulse size-2 rounded-full bg-kgl" aria-hidden="true" /> New stock in store now
            </p>
            <h1 className="wide mt-6 text-[clamp(2.8rem,6.4vw,5.6rem)] leading-[0.88]">
              Rwanda&apos;s <span className="text-glow text-kgl">#1</span><br />sneaker<br />store.
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/65">
              Nike, New Balance, Adidas, On and more from <span className="font-bold text-ink">{rwf(fromPrice)}</span>.
              Order on WhatsApp. Free delivery in Kigali, free socks with every pair.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="group inline-flex items-center gap-3 rounded-full bg-kgl py-2 pl-7 pr-2 font-bold text-white shadow-[0_10px_40px_-10px] shadow-kgl transition hover:bg-kgl-deep">
                Shop new stock
                <span className="grid size-10 place-items-center rounded-full bg-black/25 transition group-hover:translate-x-1" aria-hidden="true">→</span>
              </Link>
              <a href={waLink("Hi KGL Kicks! I'd like to order a pair.")} target="_blank" rel="noopener"
                className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-bold backdrop-blur transition hover:border-white/60">Order on WhatsApp</a>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6">
              {[[`${STORE.followers}+`, "on Instagram"], [String(PRODUCTS.length), "new pairs"], ["Free", "Kigali delivery"]].map(([v, l]) => (
                <div key={l} className="px-4 first:pl-0">
                  <dt className="sr-only">{l}</dt>
                  <dd className="wide text-2xl sm:text-3xl">{v}</dd>
                  <dd className="text-xs text-muted">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* floating shoe stage */}
          <div className="relative mx-auto aspect-square w-full max-w-[600px]">
            <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle_at_50%_45%,rgb(34_164_71/.45),rgb(34_164_71/.08)_55%,transparent_70%)]" aria-hidden="true" />
            <div className="spin-slow absolute inset-[6%] rounded-full border border-dashed border-kgl/30" aria-hidden="true" />
            <div className="absolute inset-[20%] rounded-full border border-white/5" aria-hidden="true" />

            <Link href={`/shop/${metcon.slug}`} aria-label={`${metcon.model}, ${rwf(metcon.price)}`}
              className="float shoe-shadow absolute right-[2%] top-[6%] w-[52%] opacity-90 transition hover:opacity-100 [--r:9deg] [animation-delay:-2s]">
              <img src="/shoes/cut/metcon-7-black.webp" alt="" className="w-full" />
            </Link>
            <Link href={`/shop/${boston.slug}`} aria-label={`${boston.model}, ${rwf(boston.price)}`}
              className="float shoe-shadow absolute bottom-[10%] left-[0%] w-[44%] [--r:-6deg] [animation-delay:-4s]">
              <img src="/shoes/cut/boston-taupe.webp" alt="" className="w-full" />
            </Link>
            <Link href={`/shop/${samba.slug}`} aria-label={`${samba.model}, ${rwf(samba.price)}`}
              className="float shoe-shadow absolute left-[12%] top-[34%] w-[78%] [--r:-8deg]">
              <img src="/shoes/cut/samba-maroon.webp" alt="Adidas Samba in maroon, Nike Free Metcon 7 in black and Birkenstock Boston in taupe" fetchPriority="high" className="w-full" />
            </Link>

            {/* price hotspots */}
            <Link href={`/shop/${samba.slug}`} className="absolute bottom-[22%] right-[2%] flex items-center gap-2.5 rounded-2xl border border-white/10 bg-black/60 py-2 pl-2 pr-4 backdrop-blur-md transition hover:border-kgl">
              <span className="grid size-9 place-items-center rounded-xl bg-kgl text-xs font-black text-white">NEW</span>
              <span className="text-left leading-tight"><span className="block text-xs text-muted">Samba &lsquo;{samba.colorway}&rsquo;</span><span className="font-bold">{rwf(samba.price)}</span></span>
            </Link>
            <Link href={`/shop/${metcon.slug}`} className="absolute left-[4%] top-[14%] hidden items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-sm backdrop-blur-md transition hover:border-kgl sm:flex">
              <span className="size-2 rounded-full bg-kgl" aria-hidden="true" /> Metcon 7 <span className="font-bold">{rwf(metcon.price)}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── ticker ───────── */}
      <div className="relative z-10 -rotate-1 border-y border-black bg-kgl py-3 text-black" aria-hidden="true">
        <div className="marquee flex w-max">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0">
              {TICKER.concat(TICKER).map((t, i) => (
                <span key={i} className="wide flex items-center gap-6 px-3 text-lg uppercase sm:text-xl">{t}<span className="text-black/50">✦</span></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ───────── new stock: bento grid ───────── */}
      <section className="reveal mx-auto mt-24 max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker n="01">Just landed</Kicker>
            <h2 className="wide mt-3 text-4xl sm:text-5xl">New stock</h2>
          </div>
          <Link href="/shop" className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm font-bold transition hover:border-kgl hover:text-kgl">
            Shop all {PRODUCTS.length} <span className="transition group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {latest.map((p, i) => <ProductCard key={p.slug} p={p} eager={i < 3} feature={i === 0} />)}
        </div>
      </section>

      {/* ───────── size + brand bento ───────── */}
      <section className="reveal mx-auto mt-28 grid max-w-7xl gap-4 px-4 sm:px-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="relative overflow-hidden rounded-[2rem] border border-line bg-concrete p-6 sm:p-8">
          <div className="absolute -right-24 -top-24 size-72 rounded-full bg-kgl/15 blur-3xl" aria-hidden="true" />
          <Kicker n="02">Find your fit</Kicker>
          <h2 className="wide mt-3 text-3xl sm:text-4xl">Shop your size</h2>
          <p className="mt-2 max-w-sm text-muted">Skip the &ldquo;do you have 42?&rdquo; messages. Tap your size to see only what fits.</p>
          <ul className="mt-8 grid grid-cols-5 gap-2">
            {perSize.map(([s, n]) => (
              <li key={s}>
                <Link href={`/shop?size=${s}`} className="group block rounded-2xl border border-white/10 bg-paper/60 py-3 text-center transition hover:-translate-y-1 hover:border-kgl hover:bg-kgl hover:text-white hover:shadow-[0_12px_30px_-10px] hover:shadow-kgl">
                  <span className="wide block text-2xl leading-none sm:text-3xl">{s}</span>
                  <span className="mt-1 block text-[11px] text-muted group-hover:text-white/80">{n} {n === 1 ? "model" : "models"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[2rem] border border-line bg-concrete p-6 sm:p-8">
          <Kicker n="03">Brands</Kicker>
          <h2 className="wide mt-3 text-3xl sm:text-4xl">Shop by brand</h2>
          <ul className="mt-8 grid grid-cols-2 gap-2">
            {brands.map(({ b, n, p }) => (
              <li key={b}>
                <Link href={`/shop?brand=${encodeURIComponent(b)}`} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-paper/60 p-2 pr-3 transition hover:border-kgl">
                  <span className="shot size-12 shrink-0 overflow-hidden rounded-xl">
                    <img src={img(p.photos[0])} alt="" loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-110" />
                  </span>
                  <span className="min-w-0">
                    <span className="semiwide block text-sm leading-tight">{b}</span>
                    <span className="block text-xs text-muted">{n} {n === 1 ? "model" : "models"}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────── how it works ───────── */}
      <section className="reveal mx-auto mt-28 max-w-7xl px-4 sm:px-6">
        <Kicker n="04">Easy as 1, 2, 3</Kicker>
        <h2 className="wide mt-3 text-4xl sm:text-5xl">How ordering works</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {[
            ["Pick your pair", "Every size you can tap is sitting in our store in Kigali right now."],
            ["Order on WhatsApp", "Your bag turns into a ready-written WhatsApp message. We confirm your size and how you'd like to pay."],
            ["We bring them to you", "Free delivery anywhere in Kigali, with free socks. Outside Kigali or abroad, we ship with DHL Express."],
          ].map(([t, d], i) => (
            <li key={t} className="card relative overflow-hidden rounded-[2rem] border border-line bg-concrete p-7">
              <span className="wide outline-text absolute -right-2 -top-6 text-[8rem] leading-none" aria-hidden="true">0{i + 1}</span>
              <span className="grid size-11 place-items-center rounded-full bg-kgl font-black text-white">{i + 1}</span>
              <p className="semiwide mt-10 text-xl">{t}</p>
              <p className="mt-2 text-ink/60">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ───────── the store ───────── */}
      <section className="reveal mx-auto mt-28 max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-line">
          <img src="/store/inside.jpg" alt="Inside the KGL Kicks store: walls of sneakers and leather seats" loading="lazy" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/20" aria-hidden="true" />
          <div className="relative grid gap-10 p-6 sm:p-12 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <Kicker n="05">Visit us</Kicker>
              <h2 className="wide mt-3 text-4xl sm:text-6xl">Come try<br />them on.</h2>
              <p className="mt-5 max-w-md text-lg text-ink/70">Walls full of pairs in our Kigali store. Drop by to try your size, or message us and we&apos;ll bring them to you.</p>
              <ul className="mt-8 grid max-w-lg gap-3 sm:grid-cols-2">
                {["Every pair here is in the store", "Free delivery in Kigali", "Free socks with every pair", "DHL Express worldwide"].map((t) => (
                  <li key={t} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-sm backdrop-blur">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full bg-kgl text-[10px] font-bold text-white" aria-hidden="true">✓</span>{t}
                  </li>
                ))}
              </ul>
            </div>
            <StoreCard />
          </div>
        </div>
      </section>

      {/* ───────── request ───────── */}
      <section id="request" className="reveal mx-auto mt-28 max-w-7xl scroll-mt-28 px-4 sm:px-6">
        <div className="relative grid gap-10 overflow-hidden rounded-[2.5rem] border border-line bg-concrete p-6 sm:p-12 md:grid-cols-[1fr_1.2fr]">
          <div className="absolute -bottom-32 -left-32 size-96 rounded-full bg-kgl/20 blur-[100px]" aria-hidden="true" />
          <div className="relative">
            <Kicker n="06">Special request</Kicker>
            <h2 className="wide mt-3 text-4xl sm:text-5xl">Can&apos;t find your pair?</h2>
            <p className="mt-4 max-w-sm text-lg text-ink/65">Tell us the model and size. We&apos;ll find it and send you a price before you commit.</p>
            <a href={STORE.instagram} target="_blank" rel="noopener" className="mt-6 inline-flex items-center gap-2 font-bold text-kgl underline-offset-4 hover:underline">See new stock first on Instagram ↗</a>
          </div>
          <div className="relative"><RequestForm /></div>
        </div>
      </section>
    </main>
  );
}

/** Store location: the Google Maps QR from their Instagram once we have it, otherwise directions on WhatsApp. */
function StoreCard() {
  return (
    <div className="relative mx-auto w-full max-w-md rounded-[2rem] border border-white/10 bg-black/60 p-3 text-center backdrop-blur-xl">
      {STORE.mapsQr ? (
        <>
          {/* their own "Don't get lost / Scan for directions" card from Instagram */}
          <img src={STORE.mapsQr} alt="Don't get lost: scan this QR code for directions to the KGL Kicks store in Google Maps"
            className="w-full rounded-[1.5rem] shadow-[0_30px_80px_-20px] shadow-kgl/60 ring-1 ring-kgl/30" />
          <div className="px-3 pb-3 pt-5">
            <p className="semiwide text-lg">Kigali Kicks Store</p>
            <p className="text-sm text-muted">{STORE.address}</p>
            {STORE.mapsUrl && (
              <a href={STORE.mapsUrl} target="_blank" rel="noopener"
                className="group mt-5 flex items-center justify-center gap-2 rounded-full bg-kgl py-3.5 font-bold text-white transition hover:bg-kgl-deep">
                Open in Google Maps <span className="transition group-hover:translate-x-1" aria-hidden="true">↗</span>
              </a>
            )}
            <p className="mt-3 text-xs text-muted">Scan with your phone camera, or tap the button if you&apos;re already on your phone.</p>
          </div>
        </>
      ) : (
        <>
          <img src="/store/outside.jpg" alt="The KGL Kicks store building from outside" loading="lazy" className="aspect-[4/3] w-full rounded-2xl object-cover" />
          <p className="semiwide mt-4 text-lg">KGL Kicks Store, Kigali</p>
          <a href={waLink("Hi KGL Kicks! Where is your store? I'd like to visit.")} target="_blank" rel="noopener"
            className="mt-4 block rounded-full bg-kgl py-3.5 font-bold text-white hover:bg-kgl-deep">Get directions on WhatsApp</a>
        </>
      )}
    </div>
  );
}
