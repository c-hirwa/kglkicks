import type { Metadata } from "next";
import { Suspense } from "react";
import { Shop } from "@/components/Shop";

export const metadata: Metadata = { title: "Shop sneakers" };
export default function ShopPage() {
  return <Suspense fallback={<div className="h-[60vh]" />}><Shop /></Suspense>;
}
