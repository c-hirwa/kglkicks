import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { name } from "@/lib/data";
import { getProducts } from "@/lib/inventory";
import { ProductView } from "@/components/ProductView";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = (await getProducts()).find((x) => x.slug === slug);
  return { title: p ? name(p) : "Sneaker" };
}

export default function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  // shoes added in /admin after the build aren't prerendered, so the param read streams in behind a boundary
  return (
    <Suspense fallback={<div className="mx-auto h-[80vh] max-w-7xl" />}>
      <Product params={params} />
    </Suspense>
  );
}

async function Product({ params }: { params: PageProps<"/shop/[slug]">["params"] }) {
  const { slug } = await params;
  const p = (await getProducts()).find((x) => x.slug === slug);
  if (!p) notFound();
  return <ProductView p={p} />;
}
