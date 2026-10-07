import { unsplash } from './imageStyles'

/** Example designs in the hero. Each one is a combination of catalog ids; texts are in i18n (hero.showcase). */
export const heroShowcase = [
  {
    address: 'Bodoni Moda / Luxury / Split screen',
    font: 'bodoni',
    palette: 'luxury',
    layout: 'split',
    button: 'sharp',
    images: [unsplash('1600585154340-be6161a56a0c', 700)],
  },
  {
    address: 'Space Grotesk / Neon / Fullscreen',
    font: 'space-grotesk',
    palette: 'neon',
    layout: 'fullscreen',
    button: 'pill',
    images: [unsplash('1550745165-9bc0b252726f', 900)],
  },
  {
    address: 'Fredoka / Nature / Bento',
    font: 'fredoka',
    palette: 'nature',
    layout: 'bento',
    button: 'rounded',
    images: [
      unsplash('1470071459604-3b5ec3a7fe05', 600),
      unsplash('1501785888041-af3ef285b470', 400),
      unsplash('1506905925346-21bda4d32df4', 400),
    ],
  },
]

