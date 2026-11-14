import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BagDrawer } from "@/components/BagDrawer";
import { AddedToast } from "@/components/AddedToast";

export const metadata: Metadata = {
  title: { default: "KGL Kicks, sneakers in Kigali", template: "%s | KGL Kicks" },
  description: "Rwanda's sneaker store. Nike, New Balance, Adidas, On and more from 36,500 RWF. Order on WhatsApp, free delivery in Kigali, free socks with every pair.",
};
export const viewport: Viewport = { themeColor: "#0b0b0c" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-dvh">
        <Header />
        {children}
        <Footer />
        <BagDrawer />
        <AddedToast />
      </body>
    </html>
  );
}
