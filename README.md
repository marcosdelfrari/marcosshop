# Marcos Shop

Template Next.js for an authorial print shop (woodcut, linoleum, handmade). English by default, with Spanish and French. No checkout — inquiries collect name, email and phone, then open WhatsApp.

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4
- Native i18n via `app/[lang]` + JSON dictionaries
- Theme toggle (light/dark)

## Structure

```
app/[lang]/              # locale segment (en | es | fr)
  dictionaries/          # UI copy
  page.tsx               # home / works list
  works/[slug]/page.tsx  # work detail
components/              # UI (header, sidebar, cards, inquiry dialog)
lib/
  i18n.ts                # locales + Accept-Language helper
  works.ts               # catalog (few authored pieces)
  whatsapp.ts            # wa.me URL builder
  site.ts                # brand + WhatsApp number
proxy.ts                 # locale redirect
```

## Setup

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_WHATSAPP_NUMBER`.
2. `npm install`
3. `npm run dev` → [http://localhost:3000](http://localhost:3000) redirects to `/en` (or browser language).

## Later (SEO / AEO)

Hooks are already in place for metadata, `alternates.languages`, and static params. Next steps: JSON-LD for Product/CreativeWork, sitemap, robots, and richer Open Graph images.
