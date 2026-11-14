import Link from "next/link";
import { SIZES, img, inStock, rwf, type Product, type Size } from "@/lib/data";

export function ProductCard({ p, size, eager }: { p: Product; size?: Size | null; eager?: boolean }) {
  const available = SIZES.filter((s) => (p.stock[s] ?? 0) > 0);
  const out = !inStock(p);
  return (
    <article className="group relative">
      <div className="relative overflow-hidden bg-concrete">
        <img src={img(p.photos[0], 700, 700)} alt="" loading={eager ? "eager" : "lazy"}
          className={`aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105 ${out ? "opacity-60 grayscale" : ""}`} />
        {p.photos[1] && (
          <img src={img(p.photos[1], 700, 700)} alt="" loading="lazy"
            className="absolute inset-0 aspect-square w-full object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}
        {(p.tag || out) && (
          <span className={`absolute left-0 top-3 px-2.5 py-1 text-xs font-bold ${out ? "bg-ink text-paper" : p.tag === "Last pairs" ? "bg-sun" : "bg-sky text-paper"}`}>
            {out ? "Sold out" : p.tag}
          </span>
        )}
        {size && (
          <span className="absolute right-3 top-3 rounded-full bg-paper px-2.5 py-1 text-xs font-bold">EU {size} in stock</span>
        )}
      </div>
      <div className="pt-3">
        <p className="text-sm font-semibold text-muted">{p.brand}</p>
        <h3 className="semiwide mt-0.5 leading-tight">
          <Link href={`/shop/${p.slug}`} className="after:absolute after:inset-0">{p.model} <span className="text-muted">&lsquo;{p.colorway}&rsquo;</span></Link>
        </h3>
        <p className="mt-1.5 font-bold">
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
