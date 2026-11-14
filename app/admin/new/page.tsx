import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { getAllProducts } from "@/lib/inventory";
import { brandsOf } from "@/lib/data";
import { ProductForm } from "../ProductForm";

export const metadata: Metadata = { title: "Add a shoe" };

export default function NewProduct() {
  return (
    <>
      <Link href="/admin" className="text-sm font-semibold text-muted hover:text-ink">← All shoes</Link>
      <h1 className="wide mt-3 text-4xl sm:text-5xl">Add a shoe</h1>
      <div className="mt-8">
        <Suspense fallback={<p className="text-muted">Loading…</p>}><Form /></Suspense>
      </div>
    </>
  );
}

async function Form() {
  await requireAdmin();
  return <ProductForm brands={brandsOf(await getAllProducts())} />;
}
