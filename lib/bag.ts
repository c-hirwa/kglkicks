"use client";

import { useSyncExternalStore } from "react";
import type { Size } from "./data";

export type Line = { slug: string; size: Size; qty: number };
const KEY = "kglkicks:bag";
const EVT = "kglkicks:bag";
let raw: string | null = null;
let cache: Line[] = [];
const EMPTY: Line[] = [];

function read(): Line[] {
  let r: string;
  try { r = localStorage.getItem(KEY) ?? "[]"; } catch { return cache; }
  if (r !== raw) { raw = r; try { cache = JSON.parse(r) as Line[]; } catch { cache = []; } }
  return cache;
}
function write(lines: Line[]) {
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  window.dispatchEvent(new Event(EVT));
}
const sub = (cb: () => void) => { window.addEventListener(EVT, cb); window.addEventListener("storage", cb); return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); }; };

export const useBag = () => useSyncExternalStore(sub, read, () => EMPTY);

/** `max` is the pairs in stock for that size, so the bag never holds more than the shop has. */
export function addToBag(slug: string, size: Size, max: number) {
  const lines = read();
  const found = lines.find((l) => l.slug === slug && l.size === size);
  if (found) write(lines.map((l) => (l === found ? { ...l, qty: Math.min(max, l.qty + 1) } : l)));
  else write([...lines, { slug, size, qty: 1 }]);
  window.dispatchEvent(new CustomEvent("kglkicks:added", { detail: { slug, size } }));
}
export function setQty(slug: string, size: Size, qty: number) {
  const lines = read();
  write(qty <= 0 ? lines.filter((l) => !(l.slug === slug && l.size === size)) : lines.map((l) => (l.slug === slug && l.size === size ? { ...l, qty } : l)));
}
export const clearBag = () => write([]);

// bag drawer open state
const OPEN = "kglkicks:open";
let open = false;
const subOpen = (cb: () => void) => { window.addEventListener(OPEN, cb); return () => window.removeEventListener(OPEN, cb); };
export const useBagOpen = () => useSyncExternalStore(subOpen, () => open, () => false);
export function setBagOpen(v: boolean) { open = v; window.dispatchEvent(new Event(OPEN)); }
