// Shared, client-safe store details and helpers. The shoes themselves live in data/inventory.json and are
// edited from /admin (see lib/inventory.ts); the storefront reads them through getProducts().
export const STORE = {
  name: "KGL Kicks",
  whatsapp: "250784144914",
  phoneDisplay: "+250 784 144 914",
  instagram: "https://www.instagram.com/kigali_kicks_/",
  followers: "35K",
  area: "Kigali, Rwanda",
  address: "KG 594 St, Kigali",
  /** The store's own Google Maps listing ("Kigali Kicks Store (KGL KICKS)"), so directions start from wherever the visitor is. */
  mapsUrl: "https://maps.google.com/?cid=3905124967199394403" as string | null,
  /** "Scan for directions" card from their Instagram post instagram.com/p/DZrgVN6NMmK */
  mapsQr: "/store/maps-qr.jpg" as string | null,
};

/** A photo path: either a bundled one in /public/shoes or an upload served from /media. */
export const img = (src: string) => src;

export const SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45] as const;
export type Size = (typeof SIZES)[number];
export const TAGS = ["New", "Restocked", "Last pairs"] as const;
export type Tag = (typeof TAGS)[number];

export type Product = {
  slug: string;
  brand: string;
  model: string;
  colorway: string;
  price: number; // RWF
  wasPrice?: number;
  photos: string[];
  /** pairs on hand per EU size; a missing size means none */
  stock: Partial<Record<Size, number>>;
  tag?: Tag;
  blurb: string;
  /** hidden products stay in the admin but don't show in the shop */
  hidden: boolean;
  createdAt: string;
};

export const inStock = (p: Product) => Object.values(p.stock).some((n) => (n ?? 0) > 0);
export const pairs = (p: Product) => Object.values(p.stock).reduce<number>((s, n) => s + (n ?? 0), 0);
export const name = (p: Product) => `${p.brand} ${p.model} '${p.colorway}'`;
export const newestFirst = (a: Product, b: Product) => b.createdAt.localeCompare(a.createdAt);
/** Brands in stock, most models first. */
export const brandsOf = (list: Product[]) => {
  const n = new Map<string, number>();
  for (const p of list) n.set(p.brand, (n.get(p.brand) ?? 0) + 1);
  return [...n.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([b]) => b);
};
export const fromPriceOf = (list: Product[]) => (list.length ? Math.min(...list.map((p) => p.price)) : 0);

export const DELIVERY = [
  { id: "kigali", label: "Delivery anywhere in Kigali", fee: 0 },
  { id: "pickup", label: "Pick up at our store", fee: 0 },
  { id: "upcountry", label: "Outside Kigali (we'll quote)", fee: 0 },
  { id: "dhl", label: "Abroad with DHL Express (we'll quote)", fee: 0 },
];

// EU to US men's / UK / cm (Nike chart; other brands run very close)
export const SIZE_CHART: Record<Size, [string, string, string]> = {
  36: ["4", "3.5", "22.5"], 37: ["5", "4", "23.5"],
  38: ["5.5", "5", "24"], 39: ["6.5", "6", "24.5"], 40: ["7", "6", "25"], 41: ["8", "7", "26"], 42: ["8.5", "7.5", "26.5"],
  43: ["9.5", "8.5", "27.5"], 44: ["10", "9", "28"], 45: ["11", "10", "29"],
};

export const rwf = (n: number) => `${n.toLocaleString("en-US")} RWF`;
export const waLink = (text: string) => `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;
