import type { PhotoItem } from './types'

/** Unsplash image helper. Photos are free to use under the Unsplash licence. */
export const unsplash = (id: string, w = 900, h?: number) =>
  `https://images.unsplash.com/photo-${id}?w=${w}${h ? `&h=${h}` : ''}&fit=crop&q=72&auto=format`

export const imageStyles: PhotoItem[] = [
  {
    id: 'minimal',
    name: 'Minimalistické',
    tag: 'Čisté',
    description: 'Hodně prostoru, světlé tóny a jeden jasný motiv.',
    image: unsplash('1493809842364-78817add7ffb'),
    alt: 'Světlý minimalistický obývací pokoj s modrou pohovkou',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    tag: 'Autentické',
    description: 'Skuteční lidé v přirozených situacích. Emoce a atmosféra.',
    image: unsplash('1511988617509-a57c8a288659'),
    alt: 'Skupina přátel se směje venku v západu slunce',
  },
  {
    id: 'business',
    name: 'Business',
    tag: 'Profesionální',
    description: 'Týmy, kanceláře a spolupráce. Důvěryhodný firemní dojem.',
    image: unsplash('1522202176988-66273c2fd55f'),
    alt: 'Tým lidí pracuje u stolu s notebooky',
  },
  {
    id: 'product',
    name: 'Produktové',
    tag: 'Detailní',
    description: 'Produkt v hlavní roli. Čisté pozadí a důraz na detail.',
    image: unsplash('1523275335684-37898b6baf30'),
    alt: 'Bílé chytré hodinky na světle šedém pozadí',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    tag: 'Prémiové',
    description: 'Teplé světlo, kvalitní materiály a exkluzivní prostředí.',
    image: unsplash('1600585154340-be6161a56a0c'),
    alt: 'Moderní luxusní dům za soumraku s osvětlenými okny',
  },
  {
    id: 'dark',
    name: 'Dark',
    tag: 'Kontrastní',
    description: 'Tmavé scény, barevná světla a výrazný kontrast.',
    image: unsplash('1550745165-9bc0b252726f'),
    alt: 'Retro počítačová technika v růžovém a modrém světle',
  },
  {
    id: 'nature',
    name: 'Nature',
    tag: 'Přírodní',
    description: 'Krajina, světlo a klid. Přirozené barvy bez filtrů.',
    image: unsplash('1470071459604-3b5ec3a7fe05'),
    alt: 'Zelená horská krajina s mlhou při východu slunce',
  },
  {
    id: 'creative',
    name: 'Creative',
    tag: 'Umělecké',
    description: 'Abstrakce, barvy a textury. Pro odvážné značky.',
    image: unsplash('1541701494587-cb58502866ab'),
    alt: 'Abstraktní modré a oranžové barvy rozlité ve vodě',
  },
  {
    id: 'architecture',
    name: 'Architecture',
    tag: 'Strukturované',
    description: 'Linie, geometrie a perspektiva. Pro stavby, reality a design.',
    image: unsplash('1486406146926-c627a92ad1ab'),
    alt: 'Pohled vzhůru na tmavé skleněné mrakodrapy',
  },
]
