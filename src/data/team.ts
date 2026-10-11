/** Illustrated portraits stay in their existing white 4:5 frames. */
export interface TeamMember {
  name: string
  role: string
  responsibilities: string[]
  portrait: string
}

// Copy approved by Dan on 2026-10-11.
export const team: TeamMember[] = [
  {
    name: 'Daniel Švéda',
    role: 'Design webu a značky',
    responsibilities: [
      'Navrhuje vzhled a směr vašeho webu.',
      'Hlídá, aby web i značka působily jednotně.',
    ],
    portrait: 'team/daniel.svg',
  },
  {
    name: 'Richard Buchníček',
    role: 'Vývoj a komunikace s klientem',
    responsibilities: [
      'Je vaším hlavním kontaktem při domluvě na webu.',
      'Stará se o kód, rychlost, bezpečnost a spuštění.',
    ],
    portrait: 'team/richard.svg',
  },
]
