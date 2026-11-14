// SAMPLE DATA. Prices, stock, contacts and the drop date are placeholders for the pitch.
// Swap in KGL Kicks' real details and inventory before anything goes live.
export const STORE = {
  name: "KGL Kicks",
  whatsapp: "250780000000", // replace with their WhatsApp number (no + or spaces)
  phoneDisplay: "+250 780 000 000",
  instagram: "https://www.instagram.com/",
  area: "Kigali, Rwanda",
};

export const img = (id: string, w = 900, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=72`;

export const SCENES = {
  hero: "1695748966450-3abe5c25b481", // Jordan 1 high, red/white/black
  heroAlt: "1695073621086-aa692bc32a3d", // white AF1 on red
  wall: "1633464129147-777bdcc97c1d",
  shelves: "1760302318631-a8d342cd4951",
  unbox: "1646747794382-7f3284527d42",
  lot: "1495555961986-6d4c1ecb7be3",
  onFeet: "1622866654076-8b960fc327ec",
};

export const SIZES = [38, 39, 40, 41, 42, 43, 44, 45, 46] as const;
export type Size = (typeof SIZES)[number];
export type Brand = "Jordan" | "Nike" | "Adidas";

export type Product = {
  slug: string;
  brand: Brand;
  model: string;
  colorway: string;
  styleCode: string;
  price: number; // RWF
  wasPrice?: number;
  photos: string[];
  stock: Partial<Record<Size, number>>;
  tag?: "New" | "Restocked" | "Last pairs";
  blurb: string;
  addedDaysAgo: number;
};

export const PRODUCTS: Product[] = [
  { slug: "jordan-1-high-chicago", brand: "Jordan", model: "Air Jordan 1 Retro High OG", colorway: "Chicago", styleCode: "DZ5485-612", price: 450000,
    photos: ["1695748966450-3abe5c25b481", "1656944227421-416b1d2186c9"], stock: { 41: 1, 42: 1, 44: 1 }, tag: "Last pairs", addedDaysAgo: 2,
    blurb: "The one that started it. Varsity red, white and black leather, high-top, with the original Wings logo on the collar." },
  { slug: "jordan-1-mid-gym-red", brand: "Jordan", model: "Air Jordan 1 Mid", colorway: "Gym Red", styleCode: "DQ8426-061", price: 185000,
    photos: ["1597045566677-8cf032ed6634", "1686931463322-916e93213d86"], stock: { 39: 2, 40: 3, 41: 2, 42: 4, 43: 2, 44: 1 }, addedDaysAgo: 9,
    blurb: "Everyday Jordan 1 in black, white and red. Easier to wear than the High and easier on the wallet." },
  { slug: "jordan-4-pine-green", brand: "Jordan", model: "Air Jordan 4 Retro", colorway: "Pine Green", styleCode: "DH6927-111", price: 320000,
    photos: ["1684918725924-ab55e49de549"], stock: { 40: 1, 42: 2, 43: 1 }, tag: "New", addedDaysAgo: 1,
    blurb: "White leather upper with pine green accents and grey netting. Clean enough for anything." },
  { slug: "jordan-4-fire-red", brand: "Jordan", model: "Air Jordan 4 Retro", colorway: "Fire Red", styleCode: "DC7770-160", price: 340000,
    photos: ["1610897600804-c36e2336ad3a", "1605523741177-cd660595c2cf"], stock: { 41: 1, 42: 1, 43: 2, 45: 1 }, addedDaysAgo: 6,
    blurb: "White, fire red and black, with the visible Air unit and mesh panels that made the 4 famous." },
  { slug: "jordan-4-military-black", brand: "Jordan", model: "Air Jordan 4 Retro", colorway: "Military Black", styleCode: "DH6927-111B", price: 330000,
    photos: ["1656335362192-2bc9051b1824"], stock: { 40: 2, 41: 1, 44: 2 }, tag: "Restocked", addedDaysAgo: 3,
    blurb: "White and neutral grey with black hits. The 4 people ask us about the most." },
  { slug: "nike-af1-triple-white", brand: "Nike", model: "Air Force 1 '07", colorway: "Triple White", styleCode: "CW2288-111", price: 125000,
    photos: ["1695073621086-aa692bc32a3d", "1597350584914-55bb62285896", "1696641163168-fa5c237cf4e8"], stock: { 38: 3, 39: 4, 40: 5, 41: 6, 42: 6, 43: 4, 44: 3, 45: 2, 46: 1 }, addedDaysAgo: 20,
    blurb: "All white, all leather, goes with everything. Always in stock, in every size." },
  { slug: "nike-dunk-low-panda", brand: "Nike", model: "Dunk Low Retro", colorway: "Panda", styleCode: "DD1391-100", price: 165000,
    photos: ["1623684225794-a8f1f5037f5c", "1615290642882-6b9501729a27"], stock: { 38: 2, 39: 3, 40: 4, 41: 3, 42: 3, 43: 2 }, addedDaysAgo: 12,
    blurb: "Black overlays on a white base. The Dunk you see on every street in Kimihurura, for a reason." },
  { slug: "nike-dunk-low-mint", brand: "Nike", model: "Dunk Low", colorway: "Mint", styleCode: "DD1503-117", price: 175000,
    photos: ["1692482386532-7a3c6a051144"], stock: { 38: 1, 39: 2, 40: 1, 41: 1 }, tag: "New", addedDaysAgo: 2,
    blurb: "Soft mint leather with a cream midsole. Popular with women's sizes, so they go fast." },
  { slug: "nike-sb-dunk-orange", brand: "Nike", model: "SB Dunk Low", colorway: "Orange", styleCode: "BQ6817-800", price: 210000,
    photos: ["1679111513962-762e14317937"], stock: { 42: 1, 43: 1 }, tag: "Last pairs", addedDaysAgo: 15,
    blurb: "Skate-ready SB Dunk with a padded tongue and Zoom Air insole, in loud orange." },
  { slug: "nike-air-max-1-green", brand: "Nike", model: "Air Max 1", colorway: "Green", styleCode: "FD9082-102", price: 190000,
    photos: ["1747691875590-14db938e42d4"], stock: { 40: 2, 41: 2, 42: 3, 43: 1, 44: 1 }, addedDaysAgo: 8,
    blurb: "The first visible Air, in white and grass green. Comfortable enough to walk Kigali's hills all day." },
  { slug: "nike-air-max-1-crimson", brand: "Nike", model: "Air Max 1", colorway: "Crimson", styleCode: "FD9082-106", price: 185000,
    photos: ["1600185365926-3a2ce3cdb9eb", "1600185365483-26d7a4cc7519"], stock: { 39: 1, 40: 2, 42: 2, 43: 2 }, addedDaysAgo: 18,
    blurb: "White and grey with bright crimson accents and a big Air bubble." },
  { slug: "nike-air-max-90-yellow", brand: "Nike", model: "Air Max 90", colorway: "Yellow Ochre", styleCode: "DM0029-104", price: 170000,
    photos: ["1711491559395-c82f70a68bfb"], stock: { 41: 2, 42: 2, 43: 1, 44: 2, 45: 1 }, addedDaysAgo: 25,
    blurb: "The classic 90 shape with yellow and black on white. Cushioned and tough." },
  { slug: "adidas-samba-white-black", brand: "Adidas", model: "Samba OG", colorway: "White Black", styleCode: "B75806", price: 150000,
    photos: ["1718220130188-428c7dc27fd2", "1718220095476-7916e897fc55"], stock: { 38: 2, 39: 3, 40: 3, 41: 4, 42: 3, 43: 2, 44: 1 }, tag: "Restocked", addedDaysAgo: 4,
    blurb: "White leather, black stripes, gum sole. The low-profile shoe of the moment." },
  { slug: "adidas-samba-white-green", brand: "Adidas", model: "Samba OG", colorway: "White Green", styleCode: "IG1024", price: 150000,
    photos: ["1695552836001-e34239c9c9d4"], stock: { 39: 1, 40: 2, 41: 2, 42: 1 }, addedDaysAgo: 11,
    blurb: "Same Samba, with green stripes and a gum sole. Pairs well with denim and football shirts." },
  { slug: "adidas-samba-scarlet", brand: "Adidas", model: "Samba OG", colorway: "Scarlet", styleCode: "IG1025", price: 150000, wasPrice: 165000,
    photos: ["1710504989595-604f59d1b140"], stock: {}, addedDaysAgo: 30,
    blurb: "White with scarlet stripes. Sold out for now, ask us to hold the next pair." },
];

export const bySlug = (s: string) => PRODUCTS.find((p) => p.slug === s);
export const inStock = (p: Product) => Object.values(p.stock).some((n) => (n ?? 0) > 0);
export const name = (p: Product) => `${p.model} '${p.colorway}'`;

export const DELIVERY = [
  { id: "pickup", label: "Pick up (we'll send the location)", fee: 0 },
  { id: "central", label: "Delivery: Nyarugenge, Kacyiru, Kimihurura", fee: 1500 },
  { id: "east", label: "Delivery: Remera, Kibagabaga, Nyarutarama", fee: 2000 },
  { id: "south", label: "Delivery: Kicukiro, Kanombe, Rebero", fee: 2500 },
  { id: "upcountry", label: "Outside Kigali (by bus parcel)", fee: 5000 },
];

// EU to US men's / UK / cm (Nike/Jordan chart; Adidas runs very close)
export const SIZE_CHART: Record<Size, [string, string, string]> = {
  38: ["5.5", "5", "24"], 39: ["6.5", "6", "24.5"], 40: ["7", "6", "25"], 41: ["8", "7", "26"], 42: ["8.5", "7.5", "26.5"],
  43: ["9.5", "8.5", "27.5"], 44: ["10", "9", "28"], 45: ["11", "10", "29"], 46: ["12", "11", "30"],
};

export const rwf = (n: number) => `${n.toLocaleString("en-US")} RWF`;
export const waLink = (text: string) => `https://wa.me/${STORE.whatsapp}?text=${encodeURIComponent(text)}`;

/** The next Saturday at 10:00 Kigali time (UTC+2), as a timestamp. */
export function nextDrop(now = Date.now()) {
  const k = new Date(now + 2 * 3600_000); // shift to Kigali wall clock
  const add = (6 - k.getUTCDay() + 7) % 7;
  const d = Date.UTC(k.getUTCFullYear(), k.getUTCMonth(), k.getUTCDate() + add, 10) - 2 * 3600_000;
  return d <= now ? d + 7 * 86400_000 : d;
}
export const DROP = { name: "Air Jordan 4 'Pine Green'", slug: "jordan-4-pine-green", note: "8 pairs, sizes 40 to 45" };
