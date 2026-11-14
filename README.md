# KGL Kicks: website

A website for KGL Kicks ([@kigali_kicks_](https://www.instagram.com/kigali_kicks_/)), a Kigali sneaker store that sells through Instagram and WhatsApp.

**Data in `lib/data.ts`** comes from their Instagram posts of 13 Nov 2026: the 9 shoes, prices (36,500 to 42,500 RWF),
size ranges, WhatsApp number (+250 784 144 914), free delivery in Kigali, free socks, DHL worldwide shipping.
Their posts don't give pair counts per size, so every listed size is treated as in stock. Product photos in
`public/shoes/` are cropped from those posts; store photos in `public/store/` are from their reels, and `maps-qr.jpg` is their "Scan for directions" post.
The wordmark is plain text, not their logo.

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4. Font: Archivo (variable width) via Fontsource.
No backend: the bag lives in the browser and checkout sends a ready-written WhatsApp message.

## Pages

| Route | What it is |
|---|---|
| `/` | Hero, perks strip, new stock, shop by size, shop by brand, how ordering works, visit the store, request-a-pair form |
| `/shop` | Filter by brand, EU size and price; sizes are shown per pair; filters live in the URL so a search can be shared |
| `/shop/[slug]` | Photo, size picker (EU/US/UK, unavailable sizes crossed out), size guide, add to bag, order on WhatsApp |

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

## Managing stock (`/admin`)

Go to `/admin` and sign in with `ADMIN_PASSWORD` from `.env.local` (copy `.env.example` if it's missing; change the
password there and restart the server). From the dashboard you can:

- add a shoe with photos, brand, model, colourway, price, sale price, label and description
- set stock per EU size, or tap − / + on the dashboard when a pair sells or comes in
- hide a shoe from the shop without deleting it, or delete it (photos are removed too)
- filter by running low, sold out or hidden, and search

Shoes are stored in `data/inventory.json`, and uploaded photos in `data/uploads/` (served at `/media/...`).
Changes show in the shop immediately. Edit the JSON by hand only while the server is stopped; the shop caches it.

**Hosting:** this local storage needs one long-running server (`npm run build && npm start`, on a VPS or similar).
Serverless hosts like Vercel don't keep files written at runtime, so there you'd swap `lib/inventory.ts` for a database.
