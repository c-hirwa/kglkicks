# KGL Kicks: website

A website for KGL Kicks ([@kigali_kicks_](https://www.instagram.com/kigali_kicks_/)), a Kigali sneaker store that sells through Instagram and WhatsApp.

**Data in `lib/data.ts`** comes from their Instagram posts of 13 Nov 2026: the 9 shoes, prices (36,500 to 42,500 RWF),
size ranges, WhatsApp number (+250 784 144 914), free delivery in Kigali, free socks, DHL worldwide shipping.
Their posts don't give pair counts per size, so every listed size is treated as in stock. Product photos in
`public/shoes/` are cropped from those posts; store photos in `public/store/` are from their reels.
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

## Adding new stock

Crop the post photo to a square, save it as `public/shoes/<name>.jpg`, then add an entry to `PRODUCTS` in `lib/data.ts`
with `photos: ["<name>"]`, the price and the size range.
