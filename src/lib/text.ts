/**
 * Czech typography: one-letter prepositions and conjunctions must not end a line.
 * Replaces the space after them with a non-breaking space.
 */
export function nb(text: string) {
  // Two passes cover back-to-back cases like "a v lese" (no regex lookbehind,
  // which older iOS Safari cannot parse).
  const pass = (s: string) => s.replace(/(^|[\s(])([aikosuvzAIKOSUVZ]) +/g, '$1$2 ')
  return pass(pass(text))
}

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
