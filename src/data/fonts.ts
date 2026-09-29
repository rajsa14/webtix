import '@fontsource-variable/manrope'
import '@fontsource-variable/inter'
import '@fontsource-variable/playfair-display'
import '@fontsource/anton'
import '@fontsource-variable/space-grotesk'
import '@fontsource-variable/bodoni-moda'
import '@fontsource-variable/syne'
import '@fontsource-variable/fredoka'
import '@fontsource-variable/outfit'
import type { FontItem } from './types'

/**
 * To add a font: install it from Fontsource (all of these include Czech
 * characters via the latin-ext subset), import it above, append an entry.
 */
export const fonts: FontItem[] = [
  {
    id: 'manrope',
    name: 'Manrope',
    tag: 'Modern',
    family: "'Manrope Variable', sans-serif",
    weight: 700,
    sample: 'Stavíme věci, které fungují.',
    description: 'Moderní grotesk s čistými tvary. Působí sebevědomě a zůstává dobře čitelný.',
  },
  {
    id: 'inter',
    name: 'Inter',
    tag: 'Minimal',
    family: "'Inter Variable', sans-serif",
    weight: 600,
    sample: 'Méně je někdy víc.',
    description: 'Neutrální písmo navržené pro obrazovky. Nechává vyniknout obsah.',
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    tag: 'Elegant',
    family: "'Playfair Display Variable', serif",
    weight: 600,
    sample: 'Elegance v každém detailu.',
    description: 'Kontrastní patkové písmo pro kavárny, restaurace a osobní značky.',
  },
  {
    id: 'anton',
    name: 'Anton',
    tag: 'Bold',
    family: "'Anton', sans-serif",
    weight: 400,
    uppercase: true,
    scale: 1.08,
    sample: 'Značka, kterou uvidíte.',
    description: 'Úzké a hlasité písmo pro výrazné nadpisy, sport a eventy.',
  },
  {
    id: 'space-grotesk',
    name: 'Space Grotesk',
    tag: 'Tech',
    family: "'Space Grotesk Variable', sans-serif",
    weight: 600,
    sample: 'Technologie s lidskou tváří.',
    description: 'Technický charakter s přátelskými detaily. Sedí aplikacím a startupům.',
  },
  {
    id: 'bodoni',
    name: 'Bodoni Moda',
    tag: 'Luxury',
    family: "'Bodoni Moda Variable', serif",
    weight: 500,
    sample: 'Luxus, který nemusí křičet.',
    description: 'Klasická módní antikva s vysokým kontrastem. Pro prémiové značky.',
  },
  {
    id: 'syne',
    name: 'Syne',
    tag: 'Creative',
    family: "'Syne Variable', sans-serif",
    weight: 700,
    sample: 'Kreativita bez hranic.',
    description: 'Nezvyklé proporce a výrazná šířka. Pro umělce, studia a festivaly.',
  },
  {
    id: 'fredoka',
    name: 'Fredoka',
    tag: 'Playful',
    family: "'Fredoka Variable', sans-serif",
    weight: 600,
    sample: 'Ahoj, pojďte dál!',
    description: 'Zaoblené a hravé písmo. Hodí se pro děti, volný čas a gastro.',
  },
  {
    id: 'outfit',
    name: 'Outfit',
    tag: 'Geometric',
    family: "'Outfit Variable', sans-serif",
    weight: 600,
    sample: 'Jednoduše a přehledně.',
    description: 'Geometrické písmo s měkkým výrazem. Univerzální volba pro služby.',
  },
  {
    id: 'bricolage',
    name: 'Bricolage Grotesque',
    tag: 'Expressive',
    family: "'Bricolage Grotesque Variable', sans-serif",
    weight: 700,
    sample: 'Charakter v každém písmenu.',
    description: 'Grotesk s osobitými detaily. Právě tímto písmem je napsaný web WebTix.',
  },
]

/** Czech pangram shown on every font card, so clients see diacritics. */
export const FONT_PANGRAM = 'Příliš žluťoučký kůň úpěl ďábelské ódy.'
