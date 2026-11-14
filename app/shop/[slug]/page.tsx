import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, bySlug, name } from "@/lib/data";
import { ProductView } from "@/components/ProductView";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const p = bySlug((await params).slug);
  return { title: p ? name(p) : "Sneaker" };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const p = bySlug((await params).slug);
  if (!p) notFound();
  return <ProductView slug={p.slug} />;
}
