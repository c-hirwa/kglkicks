# KGL Kicks: sample website

A pitch sample for KGL Kicks, a Kigali sneaker seller that currently sells through Instagram.

**Everything in `lib/data.ts` is placeholder:** products, prices, stock per size, WhatsApp number, Instagram link,
delivery zones and fees, the drop date, and the policies (same-day delivery, try-before-you-pay, refund on fakes).
Replace them with KGL Kicks' real details before showing it as theirs. The wordmark is plain text, not their logo.

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4. Font: Archivo (variable width) via Fontsource.
No backend: the bag lives in the browser and checkout sends a ready-written WhatsApp message.

## Pages

| Route | What it is |
|---|---|
| `/` | Hero, next-drop countdown, just landed, shop by size, brands, how ordering works, authenticity promise, request-a-pair form |
| `/shop` | Filter by brand, EU size and price; sizes are shown per pair; filters live in the URL so a search can be shared |
| `/shop/[slug]` | Photos, size picker (EU/US/UK, sold-out sizes crossed out, last pair flagged), size guide, add to bag, order on WhatsApp, box-label style code |

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
```

## Photos

Free images from [Unsplash](https://unsplash.com/license), loaded from their CDN. Model names were matched to what's in
each photo but they're stand-ins; use KGL Kicks' own product photos for the real thing.
