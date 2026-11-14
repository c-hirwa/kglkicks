import Link from "next/link";
import { SIZES, img, inStock, rwf, type Product, type Size } from "@/lib/data";

export function ProductCard({ p, size, eager, feature }: { p: Product; size?: Size | null; eager?: boolean; feature?: boolean }) {
  const available = SIZES.filter((s) => (p.stock[s] ?? 0) > 0);
  const out = !inStock(p);
  return (
    <article className={`card group relative flex flex-col rounded-[1.75rem] border border-line bg-concrete p-2 ${feature ? "col-span-2 lg:row-span-2" : ""}`}>
      <div className={`relative overflow-hidden rounded-[1.35rem] ${feature ? "aspect-square bg-[#f2f2f2] lg:aspect-auto lg:flex-1" : "shot aspect-square"}`}>
        <img src={img(p.photos[0])} alt="" loading={eager ? "eager" : "lazy"}
          className={`absolute inset-0 size-full transition-transform duration-700 ease-out group-hover:scale-[1.06] ${feature ? "object-contain" : "object-cover"} ${out ? "opacity-60 grayscale" : ""}`} />
        {(p.tag || out) && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${out ? "bg-paper text-ink" : p.tag === "Last pairs" ? "bg-sun text-black" : "bg-black text-white"}`}>
            {out ? "Sold out" : p.tag}
          </span>
        )}
        {size && <span className="absolute right-3 top-3 rounded-full bg-black/80 px-2.5 py-1 text-xs font-bold text-white">EU {size} in stock</span>}
        <span aria-hidden="true"
          className="absolute bottom-3 right-3 grid size-10 translate-y-2 place-items-center rounded-full bg-black text-lg text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          ↗
        </span>
      </div>
      <div className="flex items-end justify-between gap-3 px-2.5 pb-2 pt-3.5">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted">{p.brand}</p>
          <h3 className={`semiwide mt-1 leading-tight ${feature ? "text-xl sm:text-2xl" : ""}`}>
            <Link href={`/shop/${p.slug}`} className="after:absolute after:inset-0">{p.model} <span className="text-muted">&lsquo;{p.colorway}&rsquo;</span></Link>
          </h3>
          <p className="mt-1 text-xs text-muted">
            {out ? "Ask us to hold the next pair" : `EU ${available.length > 4 ? `${available[0]}–${available[available.length - 1]}` : available.join(", ")}`}
          </p>
        </div>
        <p className={`shrink-0 rounded-full bg-kgl/12 px-3 py-1.5 font-bold text-kgl ring-1 ring-kgl/30 ${feature ? "text-base" : "text-sm"}`}>
          {rwf(p.price).replace(" RWF", "")}<span className="ml-1 text-[10px] opacity-80">RWF</span>
          {p.wasPrice && <s className="ml-2 font-normal text-muted">{rwf(p.wasPrice)}</s>}
        </p>
      </div>
    </article>
  );
}
