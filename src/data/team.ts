/**
 * Team members. Edit roles and descriptions here.
 * To add a real photo, put it in /public/team/ and set `photo: '/team/richard.jpg'`.
 * Until then the card shows a monogram.
 */
export interface TeamMember {
  name: string
  initials: string
  role: string
  focus: string[]
  description: string
  photo: string | null
}

export const team: TeamMember[] = [
  {
    name: 'Richard Buchníček',
    initials: 'RB',
    role: 'Co-Founder',
    focus: ['Vývoj webů', 'Technika', 'Realizace'],
    description:
      'Zaměřuje se na tvorbu webů, technickou stránku projektů a realizaci nápadů do funkční podoby.',
    photo: null,
  },
  {
    name: 'Daniel Švéda',
    initials: 'DŠ',
    role: 'Co-Founder',
    focus: ['Design', 'Kreativa', 'Vizuální identita'],
    description:
      'Zaměřuje se na design, kreativní část projektů a hledání způsobů, jak vytvořit moderní a zapamatovatelný web.',
    photo: null,
  },
]
