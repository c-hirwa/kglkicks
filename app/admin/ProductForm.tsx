"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { SIZES, TAGS, img, rwf, type Product, type Size } from "@/lib/data";
import { deleteProduct, saveProduct } from "./actions";

type Photo = { key: string; url: string; file?: File };
const field = "mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-3 placeholder:text-ink/30 focus:border-kgl focus:outline-none focus:ring-3 focus:ring-kgl/30";

/** Shrink a photo in the browser so uploads stay small and fast on mobile data. */
async function shrink(file: File, max = 1600): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bmp = await createImageBitmap(file);
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    if (k === 1 && file.size < 900_000) return file;
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/jpeg", 0.86));
    return blob ? new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" }) : file;
  } catch {
    return file;
  }
}

export function ProductForm({ p, brands }: { p?: Product; brands: string[] }) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  // one ordered list: existing photos (by URL) and new ones (by file); the first is the cover
  const [photos, setPhotos] = useState<Photo[]>((p?.photos ?? []).map((u) => ({ key: u, url: img(u) })));
  const [stock, setStock] = useState<Partial<Record<Size, number>>>(p?.stock ?? {});
  const [price, setPrice] = useState(p?.price ? String(p.price) : "");
  const [busy, setBusy] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => { if (state?.error) errorRef.current?.scrollIntoView({ block: "center", behavior: "smooth" }); }, [state]);

  const total = SIZES.reduce((s, z) => s + (stock[z] ?? 0), 0);
  const photoCount = photos.length;
  const setSize = (s: Size, n: number) => setStock((o) => ({ ...o, [s]: Math.max(0, Math.min(999, Math.floor(n) || 0)) }));

  async function pick(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    const room = Math.max(0, 8 - photoCount);
    const ready = await Promise.all([...files].slice(0, room).map(shrink));
    setPhotos((l) => [...l, ...ready.map((file) => { const url = URL.createObjectURL(file); return { key: url, url, file }; })]);
    setBusy(false);
    if (fileInput.current) fileInput.current.value = "";
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.delete("photos");
    // order tokens: an existing photo's URL, or "new:N" for the Nth uploaded file
    let n = 0;
    const order = photos.map((ph) => (ph.file ? (fd.append("photos", ph.file), `new:${n++}`) : ph.key));
    fd.set("photoOrder", JSON.stringify(order));
    startTransition(() => action(fd));
  }

  const makeCover = (key: string) => setPhotos((l) => [l.find((x) => x.key === key)!, ...l.filter((x) => x.key !== key)]);
  const remove = (key: string) => setPhotos((l) => {
    const gone = l.find((x) => x.key === key);
    if (gone?.file) URL.revokeObjectURL(gone.url);
    return l.filter((x) => x.key !== key);
  });

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <input type="hidden" name="originalSlug" value={p?.slug ?? ""} />

      <div className="space-y-6">
        {/* photos */}
        <fieldset className="rounded-[2rem] border border-line bg-concrete p-5 sm:p-6">
          <legend className="sr-only">Photos</legend>
          <div className="flex items-baseline justify-between">
            <h2 className="semiwide text-lg">Photos</h2>
            <span className="text-xs text-muted">{photoCount}/8 · first one is the cover</span>
          </div>
          <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {photos.map((ph, i) => (
              <li key={ph.key} className={`group relative overflow-hidden rounded-2xl ring-2 ${i === 0 ? "ring-kgl" : "ring-transparent"}`}>
                <img src={ph.url} alt="" className="shot aspect-square w-full object-cover" />
                {i === 0 && <span className="absolute left-1.5 top-1.5 rounded-full bg-kgl px-2 py-0.5 text-[10px] font-bold uppercase text-white">Cover</span>}
                {ph.file && <span className="absolute bottom-1.5 left-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">New</span>}
                <div className="absolute right-1.5 top-1.5 flex gap-1">
                  {i > 0 && <button type="button" onClick={() => makeCover(ph.key)} className="rounded-full bg-black/75 px-2 py-1 text-[10px] font-bold text-white hover:bg-kgl" aria-label="Make this the cover photo">★</button>}
                  <button type="button" onClick={() => remove(ph.key)} className="grid size-6 place-items-center rounded-full bg-black/75 text-sm font-bold text-white hover:bg-red-500" aria-label="Remove photo">×</button>
                </div>
              </li>
            ))}
            {photoCount < 8 && (
              <li>
                <button type="button" onClick={() => fileInput.current?.click()} disabled={busy}
                  className="grid aspect-square w-full place-items-center rounded-2xl border-2 border-dashed border-line text-center text-sm font-semibold text-muted transition hover:border-kgl hover:text-kgl">
                  <span><span className="block text-3xl leading-none">+</span>{busy ? "Preparing…" : "Add photos"}</span>
                </button>
              </li>
            )}
          </ul>
          <input ref={fileInput} type="file" name="photos" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" tabIndex={-1}
            onChange={(e) => pick(e.target.files)} />
          <p className="mt-3 text-xs text-muted">Tip: square photos on a plain background look best. JPG, PNG or WebP.</p>
        </fieldset>

        {/* details */}
        <fieldset className="rounded-[2rem] border border-line bg-concrete p-5 sm:p-6">
          <h2 className="semiwide text-lg">Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Brand
              <input name="brand" required defaultValue={p?.brand} list="brand-list" placeholder="Nike" className={field} />
              <datalist id="brand-list">{brands.map((b) => <option key={b} value={b} />)}</datalist>
            </label>
            <label className="block text-sm font-semibold">Model
              <input name="model" required defaultValue={p?.model} placeholder="Dunk Low" className={field} />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">Colourway
              <input name="colorway" required defaultValue={p?.colorway} placeholder="Panda" className={field} />
            </label>
            <label className="block text-sm font-semibold sm:col-span-2">Description <span className="font-normal text-muted">(optional)</span>
              <textarea name="blurb" rows={3} defaultValue={p?.blurb} maxLength={600} placeholder="One or two lines about the shoe: colours, materials, what it goes with." className={field} />
            </label>
          </div>
        </fieldset>
      </div>

      <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        {/* price */}
        <fieldset className="rounded-[2rem] border border-line bg-concrete p-5 sm:p-6">
          <h2 className="semiwide text-lg">Price</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Price (RWF)
              <input name="price" required inputMode="numeric" value={price} onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))} placeholder="42500" className={field} />
              {price && <span className="mt-1 block text-xs text-kgl">{rwf(Number(price))}</span>}
            </label>
            <label className="block text-sm font-semibold">Was <span className="font-normal text-muted">(for a sale)</span>
              <input name="wasPrice" inputMode="numeric" defaultValue={p?.wasPrice} placeholder="50000" className={field} />
            </label>
            <label className="block text-sm font-semibold">Label
              <select name="tag" defaultValue={p?.tag ?? ""} className={field}>
                <option value="">None</option>
                {TAGS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="mt-7 flex items-center gap-3 text-sm font-semibold">
              <input type="checkbox" name="hidden" defaultChecked={p?.hidden} className="size-5 accent-[#22a447]" />
              Hide from shop
            </label>
          </div>
        </fieldset>

        {/* stock */}
        <fieldset className="rounded-[2rem] border border-line bg-concrete p-5 sm:p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="semiwide text-lg">Stock per size</h2>
            <span className="text-sm"><span className="font-bold text-kgl">{total}</span> <span className="text-muted">pairs</span></span>
          </div>
          <div className="mt-4 grid grid-cols-5 gap-2">
            {SIZES.map((s) => {
              const n = stock[s] ?? 0;
              return (
                <label key={s} className={`rounded-2xl border p-2 text-center ${n ? "border-kgl/40 bg-kgl/5" : "border-line bg-paper/60"}`}>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-muted">EU {s}</span>
                  <input name={`stock_${s}`} inputMode="numeric" value={n} onChange={(e) => setSize(s, Number(e.target.value.replace(/[^\d]/g, "")))}
                    onFocus={(e) => e.target.select()} aria-label={`Pairs in EU ${s}`}
                    className="wide w-full bg-transparent text-center text-2xl focus:outline-none" />
                  <span className="mt-1 flex justify-center gap-1">
                    <button type="button" onClick={() => setSize(s, n - 1)} className="grid size-6 place-items-center rounded-full bg-white/5 text-sm font-bold hover:bg-white/15" aria-label={`One less in EU ${s}`}>−</button>
                    <button type="button" onClick={() => setSize(s, n + 1)} className="grid size-6 place-items-center rounded-full bg-kgl/20 text-sm font-bold text-kgl hover:bg-kgl hover:text-white" aria-label={`One more in EU ${s}`}>+</button>
                  </span>
                </label>
              );
            })}
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <button type="button" onClick={() => setStock(Object.fromEntries(SIZES.map((s) => [s, Math.max(1, stock[s] ?? 0)])))} className="rounded-full border border-line px-3 py-1.5 font-semibold hover:border-ink">At least 1 in every size</button>
            <button type="button" onClick={() => setStock({})} className="rounded-full border border-line px-3 py-1.5 font-semibold hover:border-ink">Clear all</button>
          </div>
        </fieldset>

        {state?.error && <p ref={errorRef} role="alert" className="rounded-2xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">{state.error}</p>}

        <div className="flex flex-wrap items-center gap-3">
          <button disabled={pending || busy} className="flex-1 rounded-full bg-kgl py-4 font-bold text-white shadow-[0_10px_40px_-12px] shadow-kgl transition hover:bg-kgl-deep disabled:opacity-60">
            {pending ? "Saving…" : p ? "Save changes" : "Add to shop"}
          </button>
          <Link href="/admin" className="rounded-full border border-line px-6 py-4 font-bold hover:border-ink">Cancel</Link>
        </div>
        {p && <DeleteButton slug={p.slug} />}
      </div>
    </form>
  );
}

function DeleteButton({ slug }: { slug: string }) {
  const [pending, setPending] = useState(false);
  return (
    <button type="button" disabled={pending}
      onClick={() => {
        if (!confirm("Delete this shoe and its photos? This can't be undone. (To take it off the shop for now, tick “Hide from shop” instead.)")) return;
        setPending(true);
        startTransition(() => deleteProduct(slug));
      }}
      className="w-full rounded-full py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50">
      {pending ? "Deleting…" : "Delete this shoe"}
    </button>
  );
}
