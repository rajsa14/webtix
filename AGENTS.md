# Webtix (webtix.cz): rules for coding agents

Webtix is a two-person Prague web studio (Daniel "Dan" Švéda, Richard Buchníček). We rebuild small-business websites and show the client a finished first page before they pay anything. This repo is our own site. It is **live** on webtix.cz.

Read `CONTEXT.md` for the current state, the decisions behind it and what is still open. `README.md` (Czech) says where to change what.

## Branches, deploys, approval
- Work on `redesign`. `main` is GitHub's default branch and is kept identical to `redesign`: after an approved deploy, move it with `git push origin redesign:main` (fast-forward only). Never merge anything else into `main`, never force-push it, and no other long-lived branches.
- The old site and every old branch are archived in the private repo `swedishdan/webtix-archive`. Do not bring that code back here.
- Deploy to production only when Dan explicitly says "deploy". Then: `npm run lint`, `npm run build`, `npx wrangler deploy`, check webtix.cz (pages respond, no console errors, no sideways scroll at 1440 and 390), push `redesign` and then `redesign:main`, report the version ID and wait.
- A preview without touching production: `npx wrangler versions upload` (prints a workers.dev preview URL). Undo a deploy: `npx wrangler rollback`.
- Commit or push only when asked or as part of an approved deploy.
- Before deleting or rewriting files outside the task at hand, list them and wait.
- Leave untracked user files alone: `_to_delete/`, `docs/legal-text.md`, `webtix-brand-kit.zip`.

## How to work
- Small steps. After each change: `npm run lint`, `npm run build`, then Playwright screenshots at 1440 and 390 (also 1024 for layout work). Show them, list what changed, wait for approval.
- Animate only `transform`/`translate`, `opacity` and `clip-path`. Every motion needs a `prefers-reduced-motion` fallback.
- No console errors, no horizontal scroll at any width.
- Pages are pre-rendered (`scripts/prerender.mjs`) and hydrated, so components must render the same on the server and in the browser: no `window`/`document` during render, only in effects.
- Match the surrounding code: comment density, naming, small data files in `src/data/`.

## Copy
- All copy is Czech, vykání everywhere.
- Never invent copy silently. New text is a draft: say so in the code comment, list it for Dan, and mark it approved once he says so.
- Šlapadlo (hero bike shop) and the five invented businesses in the Návrhy deck (Vlnka, Hoblík, U Tří buků, Klíč, Kopretina) are invented. Keep the lines that say so ("Podnik jsme si vymysleli, chyby jsou skutečné." and the deck intro). Never present them as clients, never give them results or numbers.
- Café AdAstra is a real client, shown with the owner's written permission (`ADASTRA_WRITTEN_OK`). Use only the approved text and the screenshots in `public/images/`.
- No made-up claims: only promises the site already makes (reply within two working days, preview within `PREVIEW_DAYS` working days of the materials, free and non-binding, prices from `src/data/site.ts`).

## Brand
- Never redraw or approximate the logo. Use the files in `public/brand/` (see `docs/brand-usage.md`). The playful footer wordmark is split from that SVG (`src/data/wordmarkLetters.ts`).
- Colours, fonts and sizes are tokens in `@theme` in `src/index.css`. No gradients; shadows only where they already are.
- The two portraits are placeholders: one image per person, 4:5 frame, white background, swappable in `public/team/`.

## Hard rules (security, legal, SEO)
- Never print or commit secrets (Resend API key). Secrets live only in Worker secrets / `.dev.vars`; never use the `VITE_` prefix for them.
- No DNS, DNSSEC, Transform Rule or domain changes. Do not create broad API tokens.
- Enquiry form fields: `name`, `email`, `currentSite`, `message` (optional). The field must never be called `website`: that is the honeypot. Keep the honeypot, the fill-time check (4 s) and the rate limit (5/min per IP).
- `ICO` stays `null` until the company is registered; the footer then hides the line. "[IČO]" must never be visible. No "s.r.o." until then (`OPERATOR` in `src/data/site.ts`).
- The production build must contain no noindex (meta or `X-Robots-Tag`). Only `npm run build:staging` adds it. The thank-you page and 404 are noindex by design.
- `npm run build` fails while `ADASTRA_WRITTEN_OK` is false. Do not work around it.
- Cloudflare Web Analytics is the only analytics. No own tracking, no `/admin`. The cookie banner stays hidden while `CONSENT_NEEDED` is false.
- When adding a script, font, image or API from another domain, allow it in the Content-Security-Policy in `public/_headers`. Styles must come from our own files (no `<style>` blocks); inline `style=""` attributes are allowed.
- Adding a page: add it to `PAGES` in `src/data/site.ts` and to the routes in `src/App.tsx`; `PRERENDER` and the sitemap pick it up.
- Third-party screenshots in `docs/references/` are internal only: never publish them.
