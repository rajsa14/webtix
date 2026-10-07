/** Czech plural: czPlural(5, ['položka', 'položky', 'položek']) → "položek". */
export function czPlural(n: number, forms: [string, string, string]) {
  if (n === 1) return forms[0]
  if (n >= 2 && n <= 4) return forms[1]
  return forms[2]
}
