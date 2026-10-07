/**
 * Team members. Edit roles and descriptions here, Czech first, English in `en`.
 * To add a real photo, put it in public/team/ and set `photo: 'team/richard.jpg'`
 * (relative path, so the offline build keeps working). Until then the card shows a monogram.
 */
interface MemberText {
  role: string
  focus: string[]
  description: string
}

export interface TeamMember extends MemberText {
  name: string
  initials: string
  photo: string | null
  en: MemberText
}

export const team: TeamMember[] = [
  {
    name: 'Richard Buchníček',
    initials: 'RB',
    role: 'Vývoj a technologie',
    focus: ['Vývoj webů', 'Technika', 'Realizace'],
    description:
      'Převádí návrhy do rychlého a funkčního kódu. Řeší techniku, formuláře, výkon a to, aby web fungoval na každém zařízení.',
    photo: null,
    en: {
      role: 'Development & technology',
      focus: ['Web development', 'Tech', 'Delivery'],
      description:
        'Turns designs into fast, working code. Handles the tech, forms, performance and making sure the website works on every device.',
    },
  },
  {
    name: 'Daniel Švéda',
    initials: 'DŠ',
    role: 'Design a vizuální identita',
    focus: ['Design', 'Kreativa', 'Vizuální identita'],
    description:
      'Hledá vizuální jazyk, který k vaší značce sedí. Typografie, barvy a kompozice jsou jeho práce, stejně jako to, aby si web lidé zapamatovali.',
    photo: null,
    en: {
      role: 'Design & visual identity',
      focus: ['Design', 'Creative', 'Visual identity'],
      description:
        'Finds the visual language that fits your brand. Typography, color and composition are his job, and so is making the website memorable.',
    },
  },
]
