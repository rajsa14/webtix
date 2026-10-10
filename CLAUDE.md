# Webtix (webtix.cz) redesign

Webtix is a two-person Prague web studio (Daniel Švéda, Richard Buchníček). We rebuild small-business websites and show the client a finished first page before they pay anything. This repo is our own site. The configurator is gone; the site is being rebuilt from an approved design.

## The design is decided. Build it, don't redesign it.
- The approved design lives in `docs/design/`. Read `docs/design/README.md` first. Screenshots in `docs/design/screens/` are the target; the files in `docs/design/source/` are the exact HTML the screenshots were made from (layout, sizes, colours, copy). Treat them as the spec.
- Match the screenshots. Do not add sections, effects, badges, icons, gradients, shadows or copy that are not in the design. Do not "improve" the design on your own; if something seems wrong, say so and ask.
- All Czech copy comes from `docs/design/source/`. Never invent copy. Vykání everywhere.
- Earlier direction in this file (cream site, hanging sign in the hero, "one dark stage" for the pinned scene) is replaced by `docs/design/`. The hanging sign is not used on the homepage.

## Stack
React 19, TypeScript, Vite, Tailwind CSS v4. Hosted on Cloudflare Workers (`wrangler.jsonc`, `worker/index.ts`). Pages come from `dist/`; only `/api/*` runs the Worker. Enquiries go through Resend. Do not add anything Netlify-specific.

## How we work (mandatory)
- Work on the `redesign` branch only. Never touch `main`.
- Small steps. After each step: `npm run build:draft` (or `npm run build` once the placeholders are filled), `npm run lint`, then Playwright screenshots at 1440px and 390px next to the matching screenshot from `docs/design/screens/`. Show both, list every visible difference, then STOP and wait for approval.
- Before deleting or rewriting anything outside the current step, list the files and wait.
- Never redraw or approximate the logo. Use `public/brand/`.

## Placeholders that must block a production build
`PRICE_FROM` is now `9 990` (filled). `PREVIEW_DAYS` is `5` pracovních dnů (filled). `ICO` is not known yet: keep it as a placeholder in `src/data/site.ts` and make `npm run build` fail while it is the placeholder (`build:draft` still works).

## Content rules
- Šlapadlo (the bike shop in the hero and in "Jak to děláme") is an invented business. The page must keep the lines that say so ("Podnik jsme si vymysleli, chyby jsou skutečné."). Never present it as a client.
- Café AdAstra in the "Skutečný návrh" section is a real client. Its screenshots are in `public/images/`. Do not deploy the AdAstra section to production until Dan confirms the owner's written permission.
- The two portraits are placeholders (generic line drawings). Keep them swappable: one image per person, 4:5 frame, white background.

## Forms and backend (unchanged)
- Enquiry form fields: name, email, `currentSite`, message (optional). The field must not be called `website`: that is the honeypot. Keep the honeypot, fill-time check and rate limit. The hero input box sends `currentSite` and opens the same flow.
- Our own tracking and `/admin` are removed. Cloudflare Web Analytics only.
- Keep the cookie banner small, hidden until something needs consent, never over the hero.

## Moving off Netlify
Move security headers and redirects from `netlify.toml` into `public/_headers` and `public/_redirects` (keep the Content-Security-Policy, allow `static.cloudflareinsights.com` and `cloudflareinsights.com`, add Google Fonts only if fonts are not self-hosted). Then remove `netlify.toml`.
