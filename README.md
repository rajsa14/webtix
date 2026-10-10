# Webtix

Web studia Webtix (Daniel Švéda a Richard Buchníček). Jedna stránka: na vymyšleném servisu kol Šlapadlo ukazuje, jak předěláme web malého podniku, pak náš postup, skutečný návrh (Café AdAstra), nás dva, cenu a poptávkový formulář.

React 19 + TypeScript + Vite + Tailwind CSS v4 + Zustand. Hosting: Cloudflare Workers, poptávky přes Resend.

Schválený design je v `docs/design/` (začněte `docs/design/README.md`). Pravidla pro práci jsou v `CLAUDE.md`.

## Spuštění

```bash
npm install
npm run dev            # vývoj na http://localhost:5178
npm run build          # produkční build do dist/
npm run build:staging  # stejný build, ale celý web noindex (meta i hlavička X-Robots-Tag)
npm run build:draft    # build k místní kontrole, bez kontrol níže
npm run preview        # náhled buildu
npm run lint
```

`npm run build` neprojde, dokud je `ADASTRA_WRITTEN_OK` v `src/data/site.ts` `false` (písemný souhlas majitelky Café AdAstra).

## Kde co upravit

| Co | Soubor |
| --- | --- |
| Cena od, dny na návrh, ceny správy, IČO, souhlas AdAstra | `src/data/site.ts` |
| Titulek a popis úvodní stránky (i v `index.html`) | `HOME_META` v `src/data/site.ts` |
| Navigace, adresy stránek, e-mail | `src/data/site.ts` |
| Lidé (jméno, text, portrét) | `src/data/team.ts`, portréty v `public/team/` (4:5, bílé pozadí) |
| Úvodní scéna se Šlapadlem | `src/components/home/Hero.tsx`, časování v `heroScene.ts`, weby v `Shop.tsx` |
| Sekce pod ní | `src/components/home/` (`HowWeWork`, `RealProposal`, `Team`, `Price`) a `src/components/ContactForm.tsx` |
| Ochrana osobních údajů, obchodní podmínky | `src/data/legal.ts` |
| Barvy, písma, velikosti | `@theme` v `src/index.css` |
| Bezpečnostní hlavičky, staré adresy | `public/_headers`, `public/_redirects` |
| Náhledový obrázek pro sociální sítě | `public/og.png` (1200 × 630) |

IČO: dokud je `ICO` `null`, patička řádek s IČO nezobrazí.

## Odesílání poptávek

Stránky se servírují z `dist/`, jen adresy `/api/*` obsluhuje `worker/index.ts` (`wrangler.jsonc`). Formulář posílá poptávku na `/api/inquiry` a Worker ji přes Resend odešle na info@webtix.cz.

Nastavení:

1. V Resend (resend.com → API Keys) vytvořte klíč s oprávněním *Sending access*.
2. Uložte ho jako secret Workeru: `npx wrangler secret put RESEND_API_KEY` (nebo v Cloudflare: Workers & Pages → webtix → Settings → Variables and Secrets).
3. Odesílatel je `INQUIRY_FROM` ve `wrangler.jsonc`. Musí být na doméně ověřené v Resend.

Bez klíče Worker odpoví chybou a návštěvník uvidí výzvu napsat na info@webtix.cz. Při `npm run dev` Worker neběží, takže formulář nabídne otevřít poptávku ve vlastní poště; celý web i s Workerem lokálně spustíte `npm run build && npx wrangler dev` (klíč dejte do `.dev.vars`).

Integrace je v `src/lib/sendInquiry.ts`, text e-mailu se skládá v `src/lib/inquiry.ts`.

## Stránky

| Adresa | Co tam je |
| --- | --- |
| `/` | Celý web (sekce `#jak-to-delame`, `#navrhy`, `#kdo-jsme`, `#cena`, `#kontakt`) |
| `/poptavka-odeslana` | Poděkování po odeslání poptávky, neindexuje se |
| `/ochrana-osobnich-udaju`, `/obchodni-podminky` | Právní texty |
| staré adresy (`/katalog`, `/o-nas`, …) | přesměrování na odpovídající sekci (`public/_redirects`) |
| cokoliv jiného | Vlastní stránka 404, neindexuje se |

## Návštěvnost

Jen Cloudflare Web Analytics (zapíná se v Cloudflare, ne v kódu). Web sám nic neměří a neukládá žádné cookies; lišta se souhlasem se proto nezobrazuje (`CONSENT_NEEDED` v `src/data/site.ts`).

## Zabezpečení

- Tajné klíče jsou jen v secrets Workeru, nikdy s prefixem `VITE_` (ten se dostane do prohlížeče).
- `public/_headers` posílá bezpečnostní hlavičky (HSTS, Content-Security-Policy, zákaz vkládání do rámců). Když přidáte externí skript, obrázky nebo API z jiné domény, musíte ji povolit v `Content-Security-Policy`, jinak ji prohlížeč zablokuje.
- Formulář má limit pokusů za minutu (5 z jedné IP), kontrolu původu požadavku a ověření dat na serveru. Proti spamu je ve formuláři skryté pole a kontrola času vyplnění.

## Nasazení

`npm run build` a pak `npx wrangler deploy` nasadí Worker `webtix` i se stránkami. Náhled bez dopadu na webtix.cz: `npx wrangler versions upload` (vrátí adresu náhledu na workers.dev).
