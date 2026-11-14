import Link from "next/link";
import { SIZES, img, inStock, rwf, type Product, type Size } from "@/lib/data";

export function ProductCard({ p, size, eager }: { p: Product; size?: Size | null; eager?: boolean }) {
  const available = SIZES.filter((s) => (p.stock[s] ?? 0) > 0);
  const out = !inStock(p);
  return (
    <article className="group relative">
      <div className="shot relative overflow-hidden rounded-2xl">
        <img src={img(p.photos[0])} alt="" loading={eager ? "eager" : "lazy"}
          className={`aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105 ${out ? "opacity-60 grayscale" : ""}`} />
        {p.photos[1] && (
          <img src={img(p.photos[1])} alt="" loading="lazy"
            className="absolute inset-0 aspect-square w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}
        {(p.tag || out) && (
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ${out ? "bg-paper text-ink" : p.tag === "Last pairs" ? "bg-sun text-black" : "bg-kgl text-white"}`}>
            {out ? "Sold out" : p.tag}
          </span>
        )}
        {size && (
          <span className="absolute right-3 top-3 rounded-full bg-paper/90 px-2.5 py-1 text-xs font-bold">EU {size} in stock</span>
        )}
      </div>
      <div className="pt-3">
        <p className="text-sm font-semibold text-muted">{p.brand}</p>
        <h3 className="semiwide mt-0.5 leading-tight">
          <Link href={`/shop/${p.slug}`} className="after:absolute after:inset-0">{p.model} <span className="text-muted">&lsquo;{p.colorway}&rsquo;</span></Link>
        </h3>
        <p className="mt-1.5 font-bold text-kgl">
          {rwf(p.price)}
          {p.wasPrice && <s className="ml-2 font-normal text-muted">{rwf(p.wasPrice)}</s>}
        </p>
        <p className="mt-1 text-xs text-muted">
          {out ? "Ask us to hold the next pair" : `EU ${available.length > 4 ? `${available[0]} to ${available[available.length - 1]}` : available.join(", ")}`}
        </p>
      </div>
    </article>
  );
}
