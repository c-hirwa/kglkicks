import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { getAllProducts } from "@/lib/inventory";
import { brandsOf } from "@/lib/data";
import { ProductForm } from "../../ProductForm";

export const metadata: Metadata = { title: "Edit shoe" };

export default function EditProduct({ params }: PageProps<"/admin/edit/[slug]">) {
  return (
    <>
      <Link href="/admin" className="text-sm font-semibold text-muted hover:text-ink">← All shoes</Link>
      <Suspense fallback={<p className="mt-6 text-muted">Loading…</p>}><Form params={params} /></Suspense>
    </>
  );
}

async function Form({ params }: { params: PageProps<"/admin/edit/[slug]">["params"] }) {
  await requireAdmin();
  const [{ slug }, products] = await Promise.all([params, getAllProducts()]);
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();
  return (
    <>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <h1 className="wide text-4xl sm:text-5xl">{p.model} <span className="text-muted">&lsquo;{p.colorway}&rsquo;</span></h1>
        {!p.hidden && <Link href={`/shop/${p.slug}`} target="_blank" className="text-sm font-bold text-kgl hover:underline">View in shop ↗</Link>}
      </div>
      <div className="mt-8"><ProductForm p={p} brands={brandsOf(products)} /></div>
    </>
  );
}
