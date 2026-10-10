# Webtix logo: usage

## The pieces
- **Wordmark (master)**: "webtix" in Instrument Sans Bold (tracking −12) with a stitched x made of five squares that touch at the corners. Use it from 32 px tall.
- **Wordmark (small cut)**: the same mark with each corner joint filled by a ¼-module square. Use it from 16 to 31 px tall (email signatures, small headers).
- **x icon**: the five joined stitches on their own. Used for the favicon, app icon and avatar.
- **Otevřeno sign**: a secondary brand picture. It never replaces the logo.

## Construction
- Module = x-height ÷ 3 = 170 font units (of 1000).
- The stitched x runs exactly from baseline to x-height, with no overshoot.
- The x starts where the font's own x ink would start; the i–x gap is 52 units.

## Colour
The palette of the website (docs/design/README.md). Contrast ratios are WCAG 2.
| Role | Hex | Use |
|---|---|---|
| Paper | #F2F1EE | page ground |
| Ink | #161110 | text, primary buttons, phone frames, logo on light grounds (16.6:1 on paper) |
| Ink soft | #4A433E | paragraphs (8.6:1 on paper) |
| Muted | #6B625C | eyebrow labels, meta text (5.3:1 on paper) |
| Terracotta | #B4472A | the one accent: italic word in headings, step numbers, colour panels (4.8:1 on paper) |
| Pen | #9B2C1F | handwritten notes on pink (4.5:1, large text only), form errors (6.7:1 on paper) |
| Pink | #F4B6C8 | colour panels with ink text (11.0:1); never as text on light grounds |
| Cream | #F6EFE5 | text, notes and logo on terracotta (4.75:1) |

## Minimum size
- Master: ≥ 32 px tall on screen, ≥ 25 mm wide in print.
- Small cut: 16–31 px tall, 15–25 mm wide.
- Below 16 px: use the x icon or the plain word "Webtix".
- Otevřeno sign: ≥ 120 px / 30 mm wide, master cut only.
- The print sizes are estimates, so check a proof print first.

## Clear space
One x-height on every side of the wordmark.

## Don't
- Stretch, squash, rotate or skew it.
- Recolour individual stitches. The x is always one colour with "webti".
- Add shadows, outlines, gradients, glows or 3D.
- Place it on low-contrast grounds (for example, cream on pink is 1.5:1, ink on terracotta 3.5:1).
- Retype it in another font, or with a normal x.
- Use the master below 32 px.
- Use the Otevřeno sign as the favicon or avatar, or without the wordmark appearing on the same surface.

## Favicon in <head>
```html
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
```

## Font
Instrument Sans (SIL Open Font License), free on Google Fonts. All text in the SVG files is outlined, so you don't need the font to open them.
