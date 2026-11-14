import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { cacheLife, cacheTag } from "next/cache";
import type { Product } from "./data";

// Local, file-based inventory: data/inventory.json for the shoes and data/uploads/ for photos added in /admin.
// Works with `npm run dev` and `npm start` on one server. Serverless hosts don't keep files written at runtime,
// so moving there means swapping these functions for a database; nothing else needs to change.
const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "inventory.json");
export const UPLOADS = path.join(DATA_DIR, "uploads");
export const INVENTORY_TAG = "inventory";

type Inventory = { products: Product[] };

async function load(): Promise<Inventory> {
  try {
    return JSON.parse(await readFile(FILE, "utf8")) as Inventory;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return { products: [] };
    throw e;
  }
}

/** Every product, hidden ones included. Cached until an admin edit calls updateTag(INVENTORY_TAG). */
export async function getAllProducts(): Promise<Product[]> {
  "use cache";
  cacheTag(INVENTORY_TAG);
  cacheLife("max");
  return (await load()).products;
}

/** What the shop shows. */
export async function getProducts(): Promise<Product[]> {
  return (await getAllProducts()).filter((p) => !p.hidden);
}

// One write at a time, so two quick edits can't overwrite each other.
let queue: Promise<unknown> = Promise.resolve();

/** Read-modify-write the inventory file atomically (write to a temp file, then rename over the old one). */
export function updateInventory<T>(fn: (products: Product[]) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const inv = await load();
    const result = await fn(inv.products);
    await mkdir(DATA_DIR, { recursive: true });
    const tmp = `${FILE}.${randomBytes(4).toString("hex")}.tmp`;
    await writeFile(tmp, JSON.stringify(inv, null, 2) + "\n", "utf8");
    await rename(tmp, FILE);
    return result;
  });
  queue = run.catch(() => {});
  return run;
}

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
export const MAX_PHOTO_BYTES = 8 * 1024 * 1024;

/** Save an uploaded photo under a random name and return its public URL. */
export async function savePhoto(file: File): Promise<string> {
  const ext = TYPES[file.type];
  if (!ext) throw new Error("Photos must be JPG, PNG or WebP.");
  if (file.size > MAX_PHOTO_BYTES) throw new Error("Each photo must be under 8 MB.");
  await mkdir(UPLOADS, { recursive: true });
  const fileName = `${Date.now().toString(36)}-${randomBytes(6).toString("hex")}.${ext}`;
  await writeFile(path.join(UPLOADS, fileName), Buffer.from(await file.arrayBuffer()));
  return `/media/${fileName}`;
}
