# WebTix

Web studia WebTix (Richard Buchníček a Daniel Švéda). Návštěvník si v katalogu vybere písmo, barvy, styl fotografií, styl webu, tlačítka a layout, vidí živý náhled a pošle poptávku.

React + TypeScript + Vite + Tailwind CSS v4 + Motion + Zustand.

## Spuštění

```bash
npm install
npm run dev      # vývoj na http://localhost:5178
npm run build    # produkční build do /dist
npm run preview  # náhled produkčního buildu
```

## Kde co upravit

| Co | Soubor |
| --- | --- |
| Písma | `src/data/fonts.ts` |
| Barevné palety | `src/data/colorPalettes.ts` |
| Styly fotografií | `src/data/imageStyles.ts` |
| Styly webu | `src/data/webStyles.ts` |
| Tlačítka | `src/data/buttonStyles.ts` |
| Layouty | `src/data/layouts.ts` |
| Pořadí kategorií, limity výběru | `src/data/catalog.ts` |
| Tým (role, popisy, fotky) | `src/data/team.ts` |
| Reference (hotové weby) | `src/data/references.ts` |
| Kroky, FAQ, texty O nás, typy webu, rozpočty | `src/data/content.ts` |
| E-mail, název, navigace, IČO v patičce | `src/data/site.ts` |
| Ochrana osobních údajů, obchodní podmínky | `src/data/legal.ts` |
| Adresy stránek | `src/data/site.ts` (`PAGES`), `netlify.toml`, `public/sitemap.xml` |
| Náhledový obrázek pro sociální sítě | `public/og.png` (1200 × 630) |

Novou položku katalogu přidáte tak, že do příslušného souboru připíšete objekt. Komponenty se nemění.

**Fotky týmu:** nahrajte je do `public/team/` a v `src/data/team.ts` nastavte např. `photo: '/team/richard.jpg'`.

## Odesílání poptávek

Web běží na Cloudflare Workers (`wrangler.jsonc`). Stránky se servírují z `dist/`, jen adresy `/api/*` obsluhuje `worker/index.ts`. Formulář posílá poptávku na `/api/inquiry` a Worker ji přes Resend odešle na info@webtix.cz.

Nastavení:

1. V Resend (resend.com → API Keys) vytvořte klíč s oprávněním *Sending access*.
2. V Cloudflare (Workers & Pages → webtix → Settings → Variables and Secrets) přidejte **Secret** `RESEND_API_KEY` s tímto klíčem.
3. Odesílatel je `INQUIRY_FROM` ve `wrangler.jsonc`. Musí být na doméně ověřené v Resend.

Bez klíče Worker odpoví chybou a návštěvník uvidí výzvu napsat na info@webtix.cz. Při `npm run dev` Worker neběží, takže formulář nabídne otevřít poptávku ve vlastní poště; celý web i s Workerem lokálně spustíte `npm run build && npx wrangler dev` (klíč dejte do `.dev.vars`).

Integrace je v `src/lib/sendInquiry.ts`, text e-mailu se skládá v `src/lib/inquiry.ts`.

## Stránky

| Adresa | Co tam je |
| --- | --- |
| `/` | Úvodní stránka s rozcestníkem |
| `/katalog`, `/jak-to-funguje`, `/reference`, `/o-nas`, `/kontakt` | Hlavní stránky. Co na které je, určuje `ROUTES` v `src/App.tsx`; přepínání bez načítání řeší `src/lib/router.ts` |
| `/poptavka-odeslana` | Poděkování po odeslání poptávky (`src/components/pages/InquirySent.tsx`), neindexuje se |
| `/ochrana-osobnich-udaju`, `/obchodni-podminky` | Právní texty (`src/data/legal.ts`, zatím koncept k revizi) |
| `/admin` | Přehled návštěvnosti po přihlášení |
| cokoliv jiného | Vlastní stránka 404 |

## Návštěvnost a /admin

Web si návštěvy počítá sám, bez služeb třetích stran: `src/lib/analytics.ts` pošle zobrazení na `/api/track` (`netlify/functions/track.mts`) a to se uloží do Netlify Blobs. Neukládá se IP adresa ani cookie. Náhodný identifikátor návštěvníka vznikne až po souhlasu v cookie liště (`src/components/CookieBanner.tsx`).

Přehled je na `/admin`. Aby šlo přihlásit:

1. V Netlify (Site configuration → Environment variables) přidejte `ADMIN_PASSWORD` s dlouhým náhodným heslem, scope Functions.
2. Spusťte nový deploy.

Bez této proměnné je přihlášení vypnuté. Změna hesla odhlásí všechna zařízení. Lokálně stačí `ADMIN_PASSWORD=...` v `.env.local`; data se při vývoji drží jen v paměti dev serveru.

## Zabezpečení

- Tajné klíče jsou jen v proměnných prostředí na serveru, nikdy s prefixem `VITE_` (ten se dostane do prohlížeče).
- `netlify.toml` posílá bezpečnostní hlavičky (HSTS, Content-Security-Policy, zákaz vkládání do rámců). Když přidáte externí skript, obrázky nebo API z jiné domény, musíte ji povolit v `Content-Security-Policy`, jinak ji prohlížeč zablokuje.
- Formulář i přihlášení mají limit počtu pokusů za minutu, kontrolu původu požadavku a ověření dat na serveru. Proti spamu je ve formuláři skryté pole a kontrola času vyplnění.

## Hosting (Netlify)

Nastavení buildu je v `netlify.toml` (`npm run build`, složka `dist`). Po propojení s GitHubem se web nasadí automaticky po každém `git push` do `main`.

## Výběr v prohlížeči

Výběr se ukládá do `localStorage` pod klíčem `webtix-vyber` (`src/store/selection.ts`). Když položku z katalogu smažete, uložený výběr se při načtení sám vyčistí.

## Fotografie

Ilustrační fotografie v katalogu a náhledech jsou z Unsplash (licence Unsplash). Pro klientské weby používejte vlastní nebo licencované snímky.
