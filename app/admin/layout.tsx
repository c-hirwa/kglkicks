import type { Metadata } from "next";
import Link from "next/link";
import { Wordmark } from "@/components/Wordmark";

export const metadata: Metadata = {
  title: { default: "Inventory", template: "%s | KGL Kicks admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-paper">
      <div className="pointer-events-none fixed -top-40 right-0 size-[40rem] rounded-full bg-kgl/10 blur-[140px]" aria-hidden="true" />
      <header className="sticky top-0 z-30 border-b border-line bg-paper/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
          <Link href="/admin" className="flex items-center gap-3" aria-label="Inventory home">
            <Wordmark className="text-xl" />
            <span className="rounded-full bg-kgl/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-kgl ring-1 ring-kgl/30">Admin</span>
          </Link>
          <Link href="/" target="_blank" className="ml-auto rounded-full px-3 py-2 text-sm font-semibold text-ink/70 hover:bg-white/5 hover:text-ink">View shop ↗</Link>
        </div>
      </header>
      <div className="relative mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">{children}</div>
    </div>
  );
}
