# Webtix homepage: approved design

> **Status (2026-10-11):** this is the original design the site was built from in steps 1–7. Since then Dan approved changes that go past it: the hero plays like a short video instead of a scroll scene, "Skutečný návrh" became the six-phone Návrhy deck, sections got their own colours and numbers, plus a sticky menu, a rich footer and a new thank-you page. Where the live site and this folder differ, the live site wins (see `CONTEXT.md`). Tokens, type scale and spacing below still apply.

One page (`/`). The screenshots in `screens/` are the target. The HTML in `source/` is what they were rendered from: copy sizes, spacing, colours and Czech text from there exactly. The `.dc.html` files are design-tool files; read them as plain HTML (ignore `<x-dc>`, `<helmet>`, the `data-dc-script` block; `<dc-import name="ShopBefore">` means "insert the ShopBefore component here").

## Screens
| File | What |
|---|---|
| `hero-1-pred-desktop.png` | Hero, state 1 (before), 1440 × 900 |
| `hero-2-predelavka-desktop.png` | Hero, state 2 (mid-scroll) |
| `hero-3-po-desktop.png` | Hero, state 3 (after) |
| `hero-mobil.png` | Hero on a 390px phone, first screen |
| `sekce-desktop.png` | Everything below the hero, 1440 |
| `sekce-mobil.png` | Everything below the hero, 390 |
| `slapadlo-pred.png`, `slapadlo-po.png` | The invented bike shop's old and new site (340 × 709 phone screens) |

## Tokens
Colours:
| Name | Hex | Use |
|---|---|---|
| paper | #F2F1EE | page ground |
| ink | #161110 | text, primary buttons, phone frames |
| ink-soft | #4A433E | paragraphs |
| muted | #6B625C | eyebrow labels, meta text |
| placeholder | #E4E0DA | (unused now, keep) |
| terracotta | #B4472A | the one accent: italic word in headings, step numbers, colour panels |
| pen | #9B2C1F | handwritten notes on pink |
| pink | #F4B6C8 | colour panels |
| cream | #F6EFE5 | text and notes on terracotta |
| white | #FFFFFF | inputs, form card on terracotta uses paper |

Fonts (self-host with @fontsource):
- Instrument Sans 400, 500, 700 and 700 italic: everything.
- JetBrains Mono 400: eyebrow labels and nav only, 12px (11px mobile), uppercase, letter-spacing 0.04em.
- Caveat 700: handwritten notes only, 26px desktop / 22px mobile.
- Archivo variable (wdth 62–125): only inside the Šlapadlo "after" screen.

Type scale (desktop / mobile): hero H1 80 / 44, line-height 0.92, tracking −0.04em; section H2 64 / 40, lh 0.95, −0.035em; contact H2 88 / 48; price 96 / 56; H3 28/32 / 22/28; hero paragraph 20/30 / 16/24; section paragraph 18/28 / 16/24; meta 15 / 14.

Layout: 12-column grid at 1440, 64px side margin, 24px gutter. Phone: one column, 16px margin. The hero colour panel starts at the middle (720px). Spacing between label → heading 24, heading → paragraph 32, paragraph → form 40, form → meta 16. Sections: 160px top and bottom on desktop, 96 on phone. Radius 8 on buttons, inputs and scene cards; 12 on the form card; phone frames 44 (desktop) / 30 (mobile). No gradients. The only shadow is under the hero phone.

## The hero is one scroll scene
The three hero screenshots are three moments of ONE pinned (sticky) section, not three sections.
- Desktop: the section is about 300vh tall with a sticky 100vh inner. As the visitor scrolls:
  - The left text swaps between the three states (cross-fade, keep the same top position).
  - The right panel colour goes pink → split (terracotta above the dashed line, pink below) → terracotta.
  - Inside the phone, a dashed line moves from top to bottom; above it the new Šlapadlo site, below it the old one.
  - The handwritten notes and their arrows appear one by one in state 1, disappear in state 2, and the cream notes of state 3 appear one by one at the end.
  - Native scroll only. Scrolling back reverses it. Animate only transform, opacity and clip-path.
- Phone: the first screen is `hero-mobil.png`. Below it, the same phone scene runs inside the pink block with the same wipe, but only the two notes shown.
- `prefers-reduced-motion`: no pinning; show the three states as three static blocks one after another.
- The Šlapadlo screens are real HTML components (`ShopBefore`, `ShopAfter`), not images. Build them from `source/ShopBefore.dc.html` and `source/ShopAfter.dc.html`, scaled with CSS transform where they appear smaller.

## Below the hero (see `sekce-*.png`)
1. Jak to děláme: three steps with scene cards (pink input box, terracotta split phone, ink phone with the finished site).
2. Skutečný návrh: dark section, Café AdAstra, two phone screenshots from `public/images/` ("Dnes" and "Náš návrh"), link "Otevřít návrh ↗" to the proposal.
3. Kdo jsme: two portrait frames (placeholder line drawings from `source/Rest.dc.html`), names, one line each still to be written.
4. Cena: "od 9 990 Kč" and four questions as `<details>`; answers are in the source.
5. Poptávka: terracotta section with the four-field form.
6. Footer: wordmark, info@webtix.cz, IČO (placeholder), legal links.

## Navigation
Top nav: Jak to děláme, Návrhy, Kdo jsme, Kontakt (anchors on the same page). On phones: a two-line menu button opening the same four links.

## Accessibility
Real `<label>`s for every input, visible focus ring (2px solid, ink on light, cream on dark), text contrast as in the design, handwritten notes and drawings `aria-hidden`, the phone screens get a short alt text or `aria-label`.
