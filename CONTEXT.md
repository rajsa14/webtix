# Webtix: project context

State as of 2026-10-11. Update this file when something here stops being true.

## The business
- Webtix: Daniel Švéda (design, brand, client contact) and Richard Buchníček (code, speed, security, deployment), Prague. Company being founded: no s.r.o., no IČO yet.
- Offer: send us a link (web, Instagram or just the business name). Within `PREVIEW_DAYS` (5) working days of the materials we show a finished first page of the new site, free and non-binding. Sites from 9 990 Kč; web care with a CMS from 790 Kč/month, with edits by us from 1 490 Kč/month (all in `src/data/site.ts`).
- Promise on the site: we reply within two working days.
- Contact: info@webtix.cz. Enquiries arrive there through the form.

## What is live
- webtix.cz and www.webtix.cz, Cloudflare Worker `webtix`, built from branch `redesign` (commit `0b7815e`, version `2cc7bdb2`).
- GitHub: `rajsa14/webtix` (public, owned by Richard; Dan has write access, not admin). Only two branches: `redesign` (where we work) and `main` (the default branch, kept identical to `redesign`).
- Archive: everything from before the cleanup (old configurator site on the old `main`, the koncepty, the English draft, all 12 old branches with full history) is in the private repo `swedishdan/webtix-archive`.
- Pages: `/` (one-page site), `/poptavka-odeslana` (thank-you, noindex), `/ochrana-osobnich-udaju`, `/obchodni-podminky`, a 404 page (noindex). Old configurator addresses redirect with 301 (`public/_redirects`).
- Every page is pre-rendered into HTML with its own title, description, canonical and JSON-LD (ProfessionalService with offers, WebSite, FAQPage); `sitemap.xml` with last-change dates and `llms.txt` are generated at build time. `robots.txt` allows everyone except `/api/`.

## The homepage, top to bottom
1. **Hero**: the invented bike shop Šlapadlo's old site turns into the new one inside a phone, played like a short video (7 s, starts by itself once, replay button with a progress ring). Desktop: a cinematic start where the panel fills the screen and the text slides in after the first run or the first scroll/key/click; replays dim the text and draw a pen circle round the phone; "Chci návrh" pulses after a run. Phone: the animation sits in the first screen under the headline, the input box below it. The hero input sends `currentSite` into the enquiry form.
2. **Marquee**: two crossing bands.
3. **01 Jak to děláme** (paper): three steps with scene cards.
4. **02 Návrhy** (ink): a deck of six phones. Café AdAstra first (real, "Otevřít návrh" to adastra.webtix.cz), then five invented businesses, each with a different problem and a new site that fixes exactly that: Vlnka (hair salon, booking only by phone), Hoblík (carpenter, no photos), U Tří buků (guesthouse, desktop site on a phone), Klíč (car service, "cena dohodou"), Kopretina (florist, pop-ups). Mini sites are HTML/SVG in `caseSites.tsx`, not images. Auto-advances until touched; swipe, drag, arrows, toggle old/new.
5. **03 Kdo jsme** (pink): two portraits (placeholders), bios, a short sample chat.
6. **04 Cena** (cream): "od 9 990 Kč", care prices, four FAQ questions.
7. **05 Kontakt** (terracotta): the enquiry form. Sending shows dots, success draws a check mark ("Odesláno"), then the thank-you page shows where we will reply, a looping Šlapadlo wipe and a four-step "Co bude dál" timeline.
8. **Footer** (ink): hero line, "Chci návrh", e-mail, legal links, and a full-width wordmark whose letters jump on hover (click paints one pink).
- Around it: a smart sticky menu (slides in on scroll up past 400 px, hides on scroll down, terracotta progress line), Lenis smooth scrolling and a custom cursor (fine pointer only, off with reduced motion), reveals that replay on every entry.

## How the site came about
- The original approved design is in `docs/design/` (screens + source HTML). The site was built from it in steps 1–7, then Dan asked for changes that go past it: the hero plays like a video instead of following the scroll, the "Skutečný návrh" section became the six-phone Návrhy deck, more motion, the sticky menu, coloured sections with numbers, the rich footer and the thank-you page. Where the live site and `docs/design/` differ, the live site (Dan's later approvals) wins; `docs/design/` is still the reference for tokens, type and spacing.
- `docs/references/`: notes on five studio sites we looked at for direction (screenshots are internal only).
- Real brands (Pension Milada, danielsveda.cz, Restaurace Merkur) were discussed as references; we do not show other businesses' logos or sites without permission, hence the invented cases.

## Infrastructure
- Cloudflare Workers with static assets: pages from `dist/`, only `/api/*` runs `worker/index.ts`. Unknown addresses get `dist/404.html` with status 404.
- Enquiries: `POST /api/inquiry` → Worker checks origin, honeypot, fill time, rate limit, validates → Resend sends to info@webtix.cz from `poptavky@webtix.cz`. `RESEND_API_KEY` is a Worker secret.
- Security headers and CSP in `public/_headers` (moved from Netlify in step 7; Netlify is gone).
- Analytics: Cloudflare Web Analytics only, switched on in the Cloudflare dashboard, not in code.
- Staging: `npm run build:staging` + `npx wrangler versions upload` gives a noindexed preview URL.

## Open items
- **IČO / s.r.o.**: when the company is registered, set `ICO` and `OPERATOR` in `src/data/site.ts` and review `src/data/legal.ts`.
- **Portraits**: real photos of Dan and Richard to replace the line drawings (`public/team/`, 4:5, white background).
- **A stronger real case**: AdAstra is in the deck for now; when there is a better real project, feature it.
- **Cloudflare Web Analytics**: confirm it is enabled for webtix.cz in the dashboard.
- **Legal note**: Resend keeps its copy of each e-mail for as long as Resend decides; the privacy text says so.

## Risks
- The webtixx1@gmail.com Cloudflare login once redeployed the old site over the new one (version `d9c37df6`). Since 2026-10-11 `main` holds the new site, so a redeploy from `main` no longer brings the old one back; an old local copy still could. If webtix.cz ever shows the old configurator, roll back or redeploy from `redesign`.
- The thank-you page's recap is kept only in memory: reloading it shows the page without the recap (by design, nothing is stored).

## History (short)
- Before October 2026: configurator site on Netlify (`main`), Netlify Forms, then a Cloudflare Worker for enquiries.
- 2026-10-10 to 10-11: redesign steps 1–7 on `redesign`, legal texts, launch on Cloudflare.
- 2026-10-11: video-like hero, Návrhy deck, sticky menu, section colours, send animation, thank-you page, footer wordmark; then pre-rendering, structured data, sitemap dates, llms.txt and a stricter CSP. All live.
- 2026-10-11: GitHub cleanup. The old repo state was archived to `swedishdan/webtix-archive`, `main` was set to `redesign`, and the 10 old feature branches were deleted (open PRs #6 and #9 closed with them).
