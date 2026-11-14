"use server";

import { unlink } from "node:fs/promises";
import path from "node:path";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { SIZES, TAGS, type Product, type Size, type Tag } from "@/lib/data";
import { INVENTORY_TAG, UPLOADS, savePhoto, updateInventory } from "@/lib/inventory";
import { adminConfigured, endSession, passwordMatches, requireAdmin, startSession } from "@/lib/auth";

export type FormState = { error?: string } | undefined;

// ───────── login ─────────
let failures: number[] = [];

export async function login(_: FormState, form: FormData): Promise<FormState> {
  if (!adminConfigured()) return { error: "Admin isn't set up yet. Add ADMIN_PASSWORD and SESSION_SECRET to .env.local and restart." };
  // slow down guessing: at most 5 wrong tries a minute across the whole server
  const now = Date.now();
  failures = failures.filter((t) => now - t < 60_000);
  if (failures.length >= 5) return { error: "Too many wrong tries. Wait a minute and try again." };
  if (!passwordMatches(String(form.get("password") ?? ""))) {
    failures.push(now);
    return { error: "That password isn't right." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

// ───────── products ─────────
const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

const text = (form: FormData, k: string, max = 80) => String(form.get(k) ?? "").trim().replace(/\s+/g, " ").slice(0, max);

async function removeUpload(url: string) {
  if (!url.startsWith("/media/")) return; // bundled photos in /public stay put
  const file = path.basename(url);
  await unlink(path.join(UPLOADS, file)).catch(() => {});
}

export async function saveProduct(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();

  const original = text(form, "originalSlug");
  const brand = text(form, "brand", 40);
  const model = text(form, "model");
  const colorway = text(form, "colorway");
  const blurb = String(form.get("blurb") ?? "").trim().slice(0, 600);
  const price = Number(String(form.get("price") ?? "").replace(/[^\d]/g, ""));
  const wasRaw = String(form.get("wasPrice") ?? "").replace(/[^\d]/g, "");
  const wasPrice = wasRaw ? Number(wasRaw) : undefined;
  const tagRaw = text(form, "tag");
  const tag = (TAGS as readonly string[]).includes(tagRaw) ? (tagRaw as Tag) : undefined;
  const hidden = form.get("hidden") === "on";

  if (!brand || !model || !colorway) return { error: "Brand, model and colourway are all needed." };
  if (!Number.isInteger(price) || price < 100 || price > 10_000_000) return { error: "Enter a price in RWF, like 42500." };
  if (wasPrice !== undefined && wasPrice <= price) return { error: "The old price must be higher than the new price (or leave it empty)." };

  const stock: Partial<Record<Size, number>> = {};
  for (const s of SIZES) {
    const n = Number(form.get(`stock_${s}`) ?? 0);
    if (!Number.isInteger(n) || n < 0 || n > 999) return { error: `Stock for EU ${s} must be a whole number from 0 to 999.` };
    if (n > 0) stock[s] = n;
  }

  // photo order from the form: existing photo URLs, or "new:N" for the Nth uploaded file
  let order: string[] = [];
  try { order = (JSON.parse(String(form.get("photoOrder") ?? "[]")) as unknown[]).filter((x): x is string => typeof x === "string"); } catch {}
  const files = form.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (order.length === 0) return { error: "Add at least one photo." };
  if (order.length > 8 || files.length > 8) return { error: "Up to 8 photos per shoe." };

  let added: string[];
  try { added = await Promise.all(files.map(savePhoto)); }
  catch (e) { return { error: (e as Error).message }; }

  let slug = original;
  let removed: string[] = [];
  try {
    slug = await updateInventory((products) => {
      const existing = original ? products.find((p) => p.slug === original) : undefined;
      if (original && !existing) throw new Error("That shoe was deleted in the meantime.");
      // existing photos must really belong to this product; new ones map to the files just saved
      const photos = order.flatMap((t) => {
        const m = /^new:(\d+)$/.exec(t);
        if (m) return added[Number(m[1])] ? [added[Number(m[1])]] : [];
        return existing?.photos.includes(t) ? [t] : [];
      });
      if (!photos.length) throw new Error("Add at least one photo.");
      const next: Product = {
        slug: existing?.slug ?? "",
        brand, model, colorway, price, wasPrice, tag, blurb, hidden, stock,
        photos,
        createdAt: existing?.createdAt ?? new Date().toISOString(),
      };
      if (existing) {
        removed = existing.photos.filter((u) => !next.photos.includes(u));
        products[products.indexOf(existing)] = next;
      } else {
        const base = slugify(`${brand} ${model} ${colorway}`) || "shoe";
        let s = base, i = 2;
        while (products.some((p) => p.slug === s)) s = `${base}-${i++}`;
        next.slug = s;
        products.push(next);
      }
      return next.slug;
    });
  } catch (e) {
    await Promise.all(added.map(removeUpload));
    return { error: (e as Error).message };
  }
  await Promise.all(removed.map(removeUpload));

  updateTag(INVENTORY_TAG);
  redirect(`/admin?saved=${encodeURIComponent(slug)}`);
}

/** +1 / −1 on one size, from the dashboard. */
export async function adjustStock(slug: string, size: Size, delta: 1 | -1) {
  await requireAdmin();
  if (!SIZES.includes(size) || (delta !== 1 && delta !== -1)) return;
  await updateInventory((products) => {
    const p = products.find((x) => x.slug === slug);
    if (!p) return;
    const n = Math.max(0, Math.min(999, (p.stock[size] ?? 0) + delta));
    if (n) p.stock[size] = n; else delete p.stock[size];
  });
  updateTag(INVENTORY_TAG);
}

export async function setHidden(slug: string, hidden: boolean) {
  await requireAdmin();
  await updateInventory((products) => {
    const p = products.find((x) => x.slug === slug);
    if (p) p.hidden = hidden;
  });
  updateTag(INVENTORY_TAG);
}

export async function deleteProduct(slug: string) {
  await requireAdmin();
  const photos = await updateInventory((products) => {
    const i = products.findIndex((x) => x.slug === slug);
    if (i < 0) return [];
    return products.splice(i, 1)[0].photos;
  });
  await Promise.all(photos.map(removeUpload));
  updateTag(INVENTORY_TAG);
  redirect("/admin?deleted=1");
}
