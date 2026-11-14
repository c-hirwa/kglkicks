"use client";

import { createContext, use } from "react";
import type { Product } from "@/lib/data";

const Ctx = createContext<Product[]>([]);

/** Gives client components (bag, toast, shop filters) the live product list from the server. */
export function ProductsProvider({ products, children }: { products: Product[]; children: React.ReactNode }) {
  return <Ctx value={products}>{children}</Ctx>;
}

export const useProducts = () => use(Ctx);
export function useProduct(slug: string | null | undefined) {
  const list = use(Ctx);
  return slug ? list.find((p) => p.slug === slug) : undefined;
}
