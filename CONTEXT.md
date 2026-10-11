# Webtix: project context

State as of 2026-10-11. Update this file when something here stops being true.

## The business
- Webtix: Daniel Švéda (design, brand) and Richard Buchníček (primary client contact, code, speed, security, deployment), Prague. Company being founded: no s.r.o., no IČO yet.
- Offer: send us a link (web, Instagram or just the business name). Within `PREVIEW_DAYS` (5) working days of the materials we show a finished first page of the new site, free and non-binding. Simple one-page sites from 9 990 Kč; typical business sites usually 18 000–30 000 Kč by scope. First month of hosting, technical care, support, up to 30 minutes of minor content edits and three small revision rounds is included. Afterwards optional Care is 790 Kč/month, Care+ is 1 490 Kč/month with up to 30 minutes of minor content edits (unused time does not roll over). Care is independent of CMS; optional CMS is chosen during scoping and edits text/photos, not layout. Without care, Webtix hosting, maintenance and support end; the client owns the site/domain and can receive source code/repository for hosting elsewhere. Paid third-party services must be taken over or stop. Domain registration/renewal is separate; connecting an existing domain has no separate fee. Prices live in `src/data/site.ts`.
- Promise on the site: we reply within two working days.
- Contact: info@webtix.cz. Enquiries arrive there through the form.

## What is live
- webtix.cz and www.webtix.cz, Cloudflare Worker `webtix`, built from branch `redesign` (thank-you polish commit `32b542d`, version `a252c93c-e29b-44ee-a5b3-ff4722716fd2`; includes approved hero, pricing, team, section-label removal and thank-you changes).
- GitHub: `rajsa14/webtix` (public, owned by Richard; Dan has write access, not admin). Only two branches: `redesign` (where we work) and `main` (the default branch, kept identical to `redesign`).
- Archive: everything from before the cleanup (old configurator site on the old `main`, the koncepty, the English draft, all 12 old branches with full history) is in the private repo `swedishdan/webtix-archive`.
- Pages: `/` (one-page site), `/poptavka-odeslana` (thank-you, noindex), `/ochrana-osobnich-udaju`, `/obchodni-podminky`, a 404 page (noindex). Old configurator addresses redirect with 301 (`public/_redirects`).
- Every page is pre-rendered into HTML with its own title, description, canonical and JSON-LD (ProfessionalService with offers, WebSite, FAQPage); `sitemap.xml` with last-change dates and `llms.txt` are generated at build time. `robots.txt` allows everyone except `/api/`.

## The homepage, top to bottom
1. **Hero**: the invented bike shop Šlapadlo's old site turns into the new one inside a phone. Desktop first play takes 13.7 s: opening question (fully readable from 0.4 to 3.0 s), red-pen diagnosis, two-part wipe, the original light handwritten notes explaining the fixes (all fully readable from 9.45 to 12.7 s), fading out before the offer, then the existing proposition and URL form. A quiet “Přeskočit ukázku” jumps straight to the final offer; incidental scrolling, typing and clicks do not skip. Replay keeps the offer and entered URL available and starts with diagnosis, without repeating the question. Phone: static question, proposition and form precede the demonstration; its two notes get a reading window before the wipe. Reduced motion provides a static old/new toggle. The server-rendered hero keeps the offer and a form link to the enquiry available before hydration. The hero input sends `currentSite` into the enquiry form. Supporting text stays quiet: no studio eyebrow, no repeated question in the animated final offer, no transition narration; the invented-business caption and existing price/delivery line remain small.
2. **Marquee**: two crossing bands.
3. **01 Jak to děláme** (paper): three steps with scene cards.
4. **02 Návrhy** (ink): a deck of six phones. Café AdAstra first (real, "Otevřít návrh" to adastra.webtix.cz), then five invented businesses, each with a different problem and a new site that fixes exactly that: Vlnka (hair salon, booking only by phone), Hoblík (carpenter, no photos), U Tří buků (guesthouse, desktop site on a phone), Klíč (car service, "cena dohodou"), Kopretina (florist, pop-ups). Mini sites are HTML/SVG in `caseSites.tsx`, not images. Auto-advances until touched; swipe, drag, arrows, toggle old/new.
5. **03 Kdo jsme** (pink): two illustrated portraits, clear roles and short responsibilities. Richard is the primary client contact. A small two-message sample chat complements the profiles, animates subtly once, and stays fully readable without motion. A direct-communication statement and a link to contact follow it (copy approved by Dan on 2026-10-11).
6. **04 Cena** (cream): three visual beats: typical business-site cost (18–30k, with a smaller one-page entry price), a handwritten free first-month moment, and optional Care/Care+ editorial rows. Ownership statement, enquiry CTA and a secondary collapsed pricing FAQ. Copy and structure approved 2026-10-11; no price count-up.
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

- 2026-10-11: approved pricing redesign deployed: typical business-site range, free first-month moment, optional CMS-independent Care/Care+, ownership CTA and seven pricing FAQs. Scroll reveals, reduced motion, live page responses and desktop/mobile overflow checked.

- 2026-10-11: removed all five decorative numbered section labels above homepage headings. Main headings, anchors and process-step numbers remain. Approved production deployment checked at 1440 and 390 pixels.

- 2026-10-11: approved team roles, short responsibilities and a subtle one-time sample conversation deployed; Richard is the primary client contact. Latest pricing and section-label removal retained.
- 2026-10-11: approved post-conversion thank-you page: mobile recap labels above values, quiet examples link, accessible phone note, explicit freedom not to continue and a dedicated footer saying “Teď je řada na nás.” without a sales CTA. Other pages retain their original footer. Recap remains memory-only; no customer confirmation e-mail is sent.

- 2026-10-11: approved editorial thank-you timeline: desktop 35/65 heading and vertical steps, filled current marker, outlined future markers, always-visible copy; supporting-materials note belongs to the reply step.

- 2026-10-11: full approved thank-you redesign deployed to production, version a252c93c-e29b-44ee-a5b3-ff4722716fd2. Latest approved team changes retained.
