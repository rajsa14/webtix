/**
 * The "Návrhy" deck: Café AdAstra (a real proposal, shown with the owner's
 * written permission) and five invented businesses. The page says the
 * invented ones are invented; never present them as clients. Each invented
 * one has a different problem on its old site and a new site that fixes
 * exactly that. Results describe what the new site does, never made-up
 * numbers. Copy approved by Dan on 2026-10-11; AdAstra's
 * story is the approved text from the former "Skutečný návrh" section.
 */

/** Phone screen of the mini sites (src/components/home/caseSites.tsx), in px. */
export const SCREEN = { w: 206, h: 446 }

export type CaseId = 'adastra' | 'vlnka' | 'hoblik' | 'buky' | 'klic' | 'kopretina'

export interface CaseStudy {
  id: CaseId
  /** Shown with the owner's permission: a real proposal, not an invented business. */
  real?: boolean
  name: string
  kind: string
  city: string
  /** What was wrong with the old site (red-pen note). */
  problem: string
  /** What the new site does about it. */
  fix: string
  /** Live proposal to open (real cases only). */
  url?: string
}

export const CASES: CaseStudy[] = [
  {
    id: 'adastra',
    real: true,
    name: 'Café AdAstra',
    kind: 'Kavárna a bistro',
    city: 'Praha 2',
    problem: 'Dnešní web',
    fix: 'Návrh jsme postavili z jejich vlastních fotek a menu a majitelka ho viděla dřív, než cokoli zaplatila.',
    url: 'https://adastra.webtix.cz/',
  },
  {
    id: 'vlnka',
    name: 'Vlnka',
    kind: 'Kadeřnictví',
    city: 'Olomouc',
    problem: 'Objednat se jde jen telefonem, a to Po–Pá 8–16.',
    fix: 'Volné termíny na první pohled. Rezervace na dvě klepnutí, i v neděli večer.',
  },
  {
    id: 'hoblik',
    name: 'Hoblík',
    kind: 'Truhlářství',
    city: 'Jihlava',
    problem: 'Ani jedna fotka práce. Jen odstavce textu.',
    fix: 'Hotové kuchyně a skříně na první pohled, nabídka podle rozměrů.',
  },
  {
    id: 'buky',
    name: 'U Tří buků',
    kind: 'Penzion',
    city: 'Krkonoše',
    problem: 'Web pro počítač: na mobilu drobné písmo a posouvání do strany.',
    fix: 'Psaný pro telefon: termín, pokoj a cena na jedné obrazovce.',
  },
  {
    id: 'klic',
    name: 'Klíč',
    kind: 'Autoservis',
    city: 'Ostrava',
    problem: 'Ceny nikde, všude jen „cena dohodou“.',
    fix: 'Ceny všech služeb předem a objednání rovnou s celkovou cenou.',
  },
  {
    id: 'kopretina',
    name: 'Kopretina',
    kind: 'Květinářství',
    city: 'Plzeň',
    problem: 'Vyskakovací okna zakryjí všechno.',
    fix: 'Kytice s cenou, adresa a otevírací doba hned. Zavolat nebo navigovat jedním klepnutím.',
  },
]
