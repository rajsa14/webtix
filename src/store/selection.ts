import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { catalog, categoryById } from '../data/catalog'
import type { CategoryId } from '../data/types'

export type Selection = Record<CategoryId, string[]>

export type ToggleResult =
  | { type: 'added' }
  | { type: 'removed'; reset: number }
  | { type: 'replaced'; previousId: string; reset: number }
  | { type: 'limit'; max: number }

const emptySelection = (): Selection =>
  Object.fromEntries(catalog.map((c) => [c.id, []])) as unknown as Selection

const indexOf = (category: CategoryId) => catalog.findIndex((c) => c.id === category)

/**
 * Categories unlock one by one: the first is always open and each next one
 * opens once the one before it has a choice. Returns how many are open.
 */
export const unlockedCount = (selected: Selection) => {
  const firstEmpty = catalog.findIndex((c) => !selected[c.id]?.length)
  return firstEmpty === -1 ? catalog.length : firstEmpty + 1
}

export const isUnlocked = (selected: Selection, category: CategoryId) =>
  indexOf(category) < unlockedCount(selected)

/** First category that still waits for a choice, or undefined when all are done. */
export const nextOpenCategory = (selected: Selection) => catalog.find((c) => !selected[c.id]?.length)

/** Clears every category after `category`, so they unlock again step by step. */
const resetAfter = (selected: Selection, category: CategoryId) => {
  const next = { ...selected }
  let cleared = 0
  for (const cat of catalog.slice(indexOf(category) + 1)) {
    cleared += next[cat.id].length
    next[cat.id] = []
  }
  return { next, cleared }
}

/** Drops choices in categories that are still locked, e.g. after an older save. */
const prune = (selected: Selection) => {
  const open = unlockedCount(selected)
  const next = { ...selected }
  catalog.slice(open).forEach((c) => (next[c.id] = []))
  return next
}

interface SelectionState {
  selected: Selection
  toggle: (category: CategoryId, id: string) => ToggleResult
  /** Returns how many choices in later categories were reset. */
  remove: (category: CategoryId, id: string) => number
  /** Replaces whole categories at once, e.g. from the playground. */
  apply: (partial: Partial<Selection>) => void
  clear: () => void
}

export const useSelection = create<SelectionState>()(
  persist(
    (set, get) => ({
      selected: emptySelection(),

      toggle: (category, id) => {
        const current = get().selected[category] ?? []
        const { max } = categoryById[category]

        // Changing an earlier choice resets everything after it.
        if (current.includes(id)) {
          const { next, cleared } = resetAfter(get().selected, category)
          set({ selected: { ...next, [category]: current.filter((x) => x !== id) } })
          return { type: 'removed', reset: cleared }
        }
        // Single-select categories swap the choice instead of blocking.
        if (max === 1 && current.length === 1) {
          const { next, cleared } = resetAfter(get().selected, category)
          set({ selected: { ...next, [category]: [id] } })
          return { type: 'replaced', previousId: current[0], reset: cleared }
        }
        if (current.length >= max) return { type: 'limit', max }

        set((s) => ({ selected: { ...s.selected, [category]: [...current, id] } }))
        return { type: 'added' }
      },

      remove: (category, id) => {
        const { next, cleared } = resetAfter(get().selected, category)
        set({ selected: { ...next, [category]: next[category].filter((x) => x !== id) } })
        return cleared
      },

      apply: (partial) => set((s) => ({ selected: prune({ ...s.selected, ...partial }) })),

      clear: () => set({ selected: emptySelection() }),
    }),
    {
      name: 'webtix-vyber',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ selected: s.selected }),
      // Drop ids that no longer exist in the catalog data and add new categories.
      merge: (persisted, current) => {
        const saved = (persisted as Partial<SelectionState> | undefined)?.selected ?? {}
        const selected = emptySelection()
        for (const cat of catalog) {
          const ids = (saved as Partial<Selection>)[cat.id] ?? []
          selected[cat.id] = ids.filter((id) => cat.items.some((item) => item.id === id)).slice(0, cat.max)
        }
        return { ...current, selected: prune(selected) }
      },
    },
  ),
)

export const countSelected = (selected: Selection) =>
  Object.values(selected).reduce((sum, ids) => sum + ids.length, 0)

export const countCategoriesDone = (selected: Selection) =>
  Object.values(selected).filter((ids) => ids.length > 0).length

/** Toast suffix telling the visitor that later steps were cleared and open again one by one. */
export const resetNote = (cleared: number) => (cleared > 0 ? '. Další kroky jsme vynulovali.' : '')
