import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { getAllProducts } from "@/lib/inventory";
import { inStock, newestFirst, pairs } from "@/lib/data";
import { Inventory } from "./Inventory";
import { logout } from "./actions";

export default function AdminHome({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense fallback={<p className="text-muted">Loading inventory…</p>}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}

async function Dashboard({ searchParams }: { searchParams: PageProps<"/admin">["searchParams"] }) {
  await requireAdmin();
  const [all, sp] = await Promise.all([getAllProducts(), searchParams]);
  const products = [...all].sort(newestFirst);
  const savedSlug = typeof sp.saved === "string" ? sp.saved : null;
  const saved = savedSlug ? products.find((p) => p.slug === savedSlug) : undefined;

  const live = products.filter((p) => !p.hidden);
  const stats = [
    ["Shoes in the shop", String(live.length), `${products.length - live.length} hidden`],
    ["Pairs in stock", String(live.reduce((s, p) => s + pairs(p), 0)), "across all sizes"],
    ["Running low", String(live.filter((p) => inStock(p) && pairs(p) <= 3).length), "3 pairs or fewer"],
    ["Sold out", String(live.filter((p) => !inStock(p)).length), "still listed in the shop"],
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-kgl">Inventory</p>
          <h1 className="wide mt-2 text-4xl sm:text-5xl">Your shoes</h1>
        </div>
        <div className="flex items-center gap-2">
          <form action={logout}><button className="rounded-full px-4 py-2.5 text-sm font-semibold text-muted hover:bg-white/5 hover:text-ink">Sign out</button></form>
          <Link href="/admin/new" className="inline-flex items-center gap-2 rounded-full bg-kgl px-5 py-3 font-bold text-white shadow-[0_10px_40px_-12px] shadow-kgl transition hover:bg-kgl-deep">
            <span className="text-lg leading-none" aria-hidden="true">+</span> Add a shoe
          </Link>
        </div>
      </div>

      {saved && (
        <p role="status" className="fade-in mt-6 rounded-2xl border border-kgl/40 bg-kgl/10 px-4 py-3 text-sm">
          Saved <span className="font-bold">{saved.brand} {saved.model} &lsquo;{saved.colorway}&rsquo;</span>.{" "}
          {saved.hidden ? "It's hidden from the shop." : <Link href={`/shop/${saved.slug}`} target="_blank" className="font-bold text-kgl underline-offset-4 hover:underline">See it in the shop ↗</Link>}
        </p>
      )}
      {sp.deleted && <p role="status" className="fade-in mt-6 rounded-2xl border border-line bg-concrete px-4 py-3 text-sm">Shoe deleted.</p>}

      <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(([label, value, note]) => (
          <div key={label} className="rounded-3xl border border-line bg-concrete p-5">
            <dt className="text-sm text-muted">{label}</dt>
            <dd className="wide mt-1 text-4xl">{value}</dd>
            <dd className="mt-1 text-xs text-muted">{note}</dd>
          </div>
        ))}
      </dl>

      <Inventory products={products} />
    </>
  );
}
