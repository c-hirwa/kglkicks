// Store details and stock taken from @kigali_kicks_ on Instagram (posts of 13 Nov 2026).
// Prices and size ranges are from those posts; per-size pair counts aren't published, so each listed size is
// treated as "in stock" (the UI never shows exact counts). Update this file when new stock is posted.
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

/** Product photos live in /public/shoes, cropped from the store's own Instagram posts. */
export const img = (id: string) => `/shoes/${id}.jpg`;

export const SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45] as const;
export type Size = (typeof SIZES)[number];
export const BRANDS = ["Nike", "New Balance", "Adidas", "On", "Puma", "Birkenstock"] as const;
export type Brand = (typeof BRANDS)[number];

export type Product = {
  slug: string;
  brand: Brand;
  model: string;
  colorway: string;
  price: number; // RWF
  wasPrice?: number;
  photos: string[];
  stock: Partial<Record<Size, number>>;
  tag?: "New" | "Restocked" | "Last pairs";
  blurb: string;
  /** position in the latest drop, 0 = newest */
  order: number;
};

const range = (from: Size, to: Size, extra: Size[] = []) =>
  Object.fromEntries([...extra, ...SIZES.filter((s) => s >= from && s <= to)].map((s) => [s, 3])) as Product["stock"];

export const PRODUCTS: Product[] = [
  { slug: "new-balance-990v4-grey", brand: "New Balance", model: "990v4", colorway: "Grey", price: 42500,
    photos: ["nb-990v4-grey"], stock: range(40, 45), tag: "New", order: 0,
    blurb: "Grey suede and mesh with the big N on the side. The dad-shoe classic that goes with everything." },
  { slug: "nike-free-metcon-7-triple-black", brand: "Nike", model: "Free Metcon 7", colorway: "Triple Black", price: 42500,
    photos: ["metcon-7-black"], stock: range(40, 45), tag: "New", order: 1,
    blurb: "All-black training shoe: flexible up front, stable at the heel. Gym to street without a second thought." },
  { slug: "on-cloudtilt-eclipse-cinder", brand: "On", model: "Cloudtilt", colorway: "Eclipse Cinder", price: 42500,
    photos: ["on-cloudtilt"], stock: range(38, 43), tag: "New", order: 2,
    blurb: "Soft knit upper on a chunky CloudTec sole in warm grey. Made for long days on your feet." },
  { slug: "nike-air-force-1-low-triple-white", brand: "Nike", model: "Air Force 1 Low", colorway: "Triple White", price: 36500,
    photos: ["af1-white"], stock: range(40, 45, [36, 37, 38]), order: 3,
    blurb: "All white, all leather. The pair everyone needs at least one of." },
  { slug: "puma-speedcat-og-nuance-grey", brand: "Puma", model: "Speedcat OG", colorway: "Nuance Grey", price: 39500,
    photos: ["speedcat-grey"], stock: range(36, 41), tag: "New", order: 4,
    blurb: "Slim grey suede racing shoe with a low profile. The look of the season." },
  { slug: "nike-vomero-5-cool-grey", brand: "Nike", model: "Zoom Vomero 5", colorway: "Cool Grey", price: 42500,
    photos: ["vomero-5-grey"], stock: range(40, 45), order: 5,
    blurb: "Layered silver and grey mesh on a cushioned runner sole. Techy, comfy, everywhere right now." },
  { slug: "nike-dunk-low-midnight-navy", brand: "Nike", model: "Dunk Low", colorway: "Midnight Navy", price: 39500,
    photos: ["dunk-navy"], stock: range(38, 43), order: 6,
    blurb: "Navy overlays on white leather with a grey Swoosh. Easy to wear, easy to love." },
  { slug: "birkenstock-boston-taupe-haze", brand: "Birkenstock", model: "Boston", colorway: "Taupe Haze", price: 42500,
    photos: ["boston-taupe"], stock: range(40, 45), order: 7,
    blurb: "Suede clog on the cork footbed. Slip on, slip off, comfortable all day." },
  { slug: "adidas-samba-maroon", brand: "Adidas", model: "Samba", colorway: "Maroon", price: 37500,
    photos: ["samba-maroon"], stock: range(36, 41), order: 8,
    blurb: "Deep maroon leather, cream stripes and a gum sole. A fresh take on the Samba." },
];

export const bySlug = (s: string) => PRODUCTS.find((p) => p.slug === s);
export const inStock = (p: Product) => Object.values(p.stock).some((n) => (n ?? 0) > 0);
export const name = (p: Product) => `${p.brand} ${p.model} '${p.colorway}'`;

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
export const fromPrice = Math.min(...PRODUCTS.map((p) => p.price));
