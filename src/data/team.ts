/**
 * The two people in "Kdo jsme", in the design's order.
 *
 * Portraits are one image per person in public/team/, shown in a 4:5 frame on
 * white. The current files are the placeholder line drawings from the design;
 * to use a real portrait, replace the file (or point `portrait` at a new one).
 */
export interface TeamMember {
  name: string
  bio: string
  portrait: string
}

export const team: TeamMember[] = [
  {
    name: 'Daniel Švéda',
    bio: 'Daniel je spoluzakladatel Webtixu. Navrhuje weby a značky a vždycky je dotáhne do konce, od prvního nápadu po spuštění. Sestavoval týmy a řídil online komunity i školní redakci, takže ví, jak z rozpracované věci udělat hotovou. Za vaším projektem stojí od první schůzky do posledního detailu.',
    portrait: 'team/daniel.svg',
  },
  {
    name: 'Richard Buchníček',
    bio: 'Richard je spoluzakladatel Webtixu. Stará se o všechno, co běží pod kapotou: kód, rychlost, bezpečnost a nasazení. Díky němu web nejen skvěle vypadá, ale také se rychle načte a funguje bez výpadků.',
    portrait: 'team/richard.svg',
  },
]
