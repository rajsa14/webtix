import type { PaletteItem } from './types'

/**
 * `colors` is what the client sees on the card.
 * `roles` tells the live preview how to apply the palette to a website.
 */
export const colorPalettes: PaletteItem[] = [
  {
    id: 'midnight',
    name: 'Midnight',
    tag: 'Tmavá',
    description: 'Černá, tmavě modrá a světle modrá. Klidná a technologická.',
    colors: [
      { name: 'Noc', hex: '#0B1020' },
      { name: 'Hlubina', hex: '#16213E' },
      { name: 'Kobalt', hex: '#2743A8' },
      { name: 'Obloha', hex: '#8CB8FF' },
    ],
    roles: { bg: '#0B1020', surface: '#16213E', text: '#EAF0FF', muted: '#8E9BC0', accent: '#8CB8FF', onAccent: '#0B1020', accent2: '#2743A8' },
  },
  {
    id: 'luxury',
    name: 'Luxury',
    tag: 'Prémiová',
    description: 'Černá, krémová a zlatá. Pro značky, které chtějí působit exkluzivně.',
    colors: [
      { name: 'Onyx', hex: '#0E0D0B' },
      { name: 'Grafit', hex: '#1F1D19' },
      { name: 'Krém', hex: '#EFE6D2' },
      { name: 'Zlato', hex: '#C9A45C' },
    ],
    roles: { bg: '#0E0D0B', surface: '#1F1D19', text: '#EFE6D2', muted: '#A39B8A', accent: '#C9A45C', onAccent: '#0E0D0B', accent2: '#E8D3A2' },
  },
  {
    id: 'ocean',
    name: 'Ocean',
    tag: 'Svěží',
    description: 'Modrá, tyrkysová a bílá. Čistá a důvěryhodná.',
    colors: [
      { name: 'Hloubka', hex: '#0A4D8C' },
      { name: 'Laguna', hex: '#16B3C2' },
      { name: 'Pěna', hex: '#E3F5FA' },
      { name: 'Bílá', hex: '#FFFFFF' },
    ],
    roles: { bg: '#F3FAFC', surface: '#FFFFFF', text: '#0B2D4D', muted: '#557189', accent: '#0A5DA8', onAccent: '#FFFFFF', accent2: '#16B3C2' },
  },
  {
    id: 'nature',
    name: 'Nature',
    tag: 'Přírodní',
    description: 'Zelená, béžová a bílá. Přirozená, klidná a přátelská.',
    colors: [
      { name: 'Les', hex: '#2F5D3A' },
      { name: 'Mech', hex: '#7C9A6B' },
      { name: 'Len', hex: '#DCCFB4' },
      { name: 'Bílá', hex: '#F8F6F0' },
    ],
    roles: { bg: '#F8F6F0', surface: '#EDE6D6', text: '#1D2B20', muted: '#5E6B5F', accent: '#2F5D3A', onAccent: '#F8F6F0', accent2: '#7C9A6B' },
  },
  {
    id: 'neon',
    name: 'Neon',
    tag: 'Výrazná',
    description: 'Černá s neonovým akcentem. Energická a nepřehlédnutelná.',
    colors: [
      { name: 'Tma', hex: '#0A0A0C' },
      { name: 'Uhel', hex: '#18181D' },
      { name: 'Neon', hex: '#C6FF3D' },
      { name: 'Bílá', hex: '#F2F2F2' },
    ],
    roles: { bg: '#0A0A0C', surface: '#18181D', text: '#F2F2F2', muted: '#9A9AA3', accent: '#C6FF3D', onAccent: '#0A0A0C', accent2: '#3DF2FF' },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    tag: 'Čistá',
    description: 'Bílá, černá a šedá. Nadčasová volba, která nikdy neomrzí.',
    colors: [
      { name: 'Bílá', hex: '#FFFFFF' },
      { name: 'Mlha', hex: '#EDEDED' },
      { name: 'Šedá', hex: '#8F8F8F' },
      { name: 'Černá', hex: '#111111' },
    ],
    roles: { bg: '#FFFFFF', surface: '#F2F2F2', text: '#111111', muted: '#6E6E6E', accent: '#111111', onAccent: '#FFFFFF', accent2: '#8F8F8F' },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    tag: 'Teplá',
    description: 'Oranžová, růžová a fialová. Hravá a plná energie.',
    colors: [
      { name: 'Oranž', hex: '#FF7A45' },
      { name: 'Růže', hex: '#FF4F8B' },
      { name: 'Fialka', hex: '#7B3FE4' },
      { name: 'Pudr', hex: '#FFF4EE' },
    ],
    roles: { bg: '#FFF4EE', surface: '#FFFFFF', text: '#2A1033', muted: '#7A5A73', accent: '#E8452F', onAccent: '#FFFFFF', accent2: '#FF4F8B' },
  },
  {
    id: 'purple',
    name: 'Purple',
    tag: 'Kreativní',
    description: 'Tmavě fialová, světle fialová a bílá. Kreativní a moderní.',
    colors: [
      { name: 'Švestka', hex: '#1E0F3C' },
      { name: 'Ametyst', hex: '#4B2A8C' },
      { name: 'Levandule', hex: '#B9A3FF' },
      { name: 'Bílá', hex: '#F7F4FF' },
    ],
    roles: { bg: '#1E0F3C', surface: '#2D1A57', text: '#F7F4FF', muted: '#B3A6D6', accent: '#B9A3FF', onAccent: '#1E0F3C', accent2: '#4B2A8C' },
  },
  {
    id: 'terracotta',
    name: 'Terracotta',
    tag: 'Zemitá',
    description: 'Cihlová, břidlicová a pískově šedá. Poctivá řemeslná atmosféra.',
    colors: [
      { name: 'Cihla', hex: '#B85C38' },
      { name: 'Břidlice', hex: '#37404A' },
      { name: 'Písek', hex: '#E7E3DD' },
      { name: 'Kouř', hex: '#9AA1A8' },
    ],
    roles: { bg: '#E7E3DD', surface: '#F4F2EE', text: '#22282E', muted: '#5F6770', accent: '#A64F2E', onAccent: '#FFFFFF', accent2: '#37404A' },
  },
  {
    id: 'pastel',
    name: 'Pastel',
    tag: 'Jemná',
    description: 'Pudrově růžová, mátová a nebeská. Lehká a přívětivá.',
    colors: [
      { name: 'Pudr', hex: '#FFD6E0' },
      { name: 'Máta', hex: '#C7F0DB' },
      { name: 'Nebe', hex: '#CFE3FF' },
      { name: 'Inkoust', hex: '#2B2B40' },
    ],
    roles: { bg: '#FDF7FA', surface: '#FFFFFF', text: '#2B2B40', muted: '#6D6D85', accent: '#2B2B40', onAccent: '#FFFFFF', accent2: '#FFD6E0' },
  },
]
