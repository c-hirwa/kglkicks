import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BagDrawer } from "@/components/BagDrawer";
import { AddedToast } from "@/components/AddedToast";

export const metadata: Metadata = {
  title: { default: "KGL Kicks, authentic sneakers in Kigali", template: "%s | KGL Kicks" },
  description: "Authentic Jordans, Nike and Adidas in Kigali. See real sizes in stock, order on WhatsApp, pay with MoMo and get them delivered the same day.",
};
export const viewport: Viewport = { themeColor: "#000000" };

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
