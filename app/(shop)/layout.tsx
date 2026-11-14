import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BagDrawer } from "@/components/BagDrawer";
import { AddedToast } from "@/components/AddedToast";
import { ProductsProvider } from "@/components/ProductsProvider";
import { getProducts } from "@/lib/inventory";

/** Storefront chrome. Products come from the cached inventory, so they're part of the static shell
 *  and refresh as soon as an admin edit clears the "inventory" cache tag. */
export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const products = await getProducts();
  return (
    <ProductsProvider products={products}>
      <Header />
      {children}
      <Footer />
      <BagDrawer />
      <AddedToast />
    </ProductsProvider>
  );
}
