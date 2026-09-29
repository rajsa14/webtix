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
| Kroky, FAQ, texty O nás, typy webu, rozpočty | `src/data/content.ts` |
| E-mail, název, navigace | `src/data/site.ts` |
| Ochrana osobních údajů, obchodní podmínky | `src/components/LegalDialog.tsx` |

Novou položku katalogu přidáte tak, že do příslušného souboru připíšete objekt. Komponenty se nemění.

**Fotky týmu:** nahrajte je do `public/team/` a v `src/data/team.ts` nastavte např. `photo: '/team/richard.jpg'`.

## Odesílání poptávek

Web je frontend a sám e-maily neposílá. Bez nastavení formulář nic nepředstírá: připraví text poptávky a nabídne návštěvníkovi otevřít ho ve vlastní poště nebo zkopírovat.

Pro automatické odesílání nastavte proměnnou `VITE_INQUIRY_ENDPOINT` (viz `.env.example`):

- **Vlastní serverless funkce s Resend**: `api/inquiry.ts` je připravená pro Vercel. Na hostingu nastavte `RESEND_API_KEY` a `INQUIRY_FROM` (jen na serveru, nikdy s prefixem `VITE_`) a `VITE_INQUIRY_ENDPOINT=/api/inquiry`.
- **Formspree**: vytvořte formulář s cílovým e-mailem webtixx1@gmail.com a nastavte `VITE_INQUIRY_ENDPOINT=https://formspree.io/f/<id>`.
- **Lokální test**: `VITE_INQUIRY_ENDPOINT=/api/dev-inquiry` v `.env.local`. Poptávka se jen vypíše do terminálu dev serveru.

Integrace je v `src/lib/sendInquiry.ts`, text e-mailu se skládá v `src/lib/inquiry.ts`.

## Výběr v prohlížeči

Výběr se ukládá do `localStorage` pod klíčem `webtix-vyber` (`src/store/selection.ts`). Když položku z katalogu smažete, uložený výběr se při načtení sám vyčistí.

## Fotografie

Ilustrační fotografie v katalogu a náhledech jsou z Unsplash (licence Unsplash). Pro klientské weby používejte vlastní nebo licencované snímky.
