import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { catalog, categoryById } from '../data/catalog'
import type { CategoryId } from '../data/types'

export type Selection = Record<CategoryId, string[]>

export type ToggleResult =
  | { type: 'added' }
  | { type: 'removed' }
  | { type: 'replaced'; previousId: string }
  | { type: 'limit'; max: number }

const emptySelection = (): Selection =>
  Object.fromEntries(catalog.map((c) => [c.id, []])) as unknown as Selection

interface SelectionState {
  selected: Selection
  toggle: (category: CategoryId, id: string) => ToggleResult
  remove: (category: CategoryId, id: string) => void
  clear: () => void
}

export const useSelection = create<SelectionState>()(
  persist(
    (set, get) => ({
      selected: emptySelection(),

      toggle: (category, id) => {
        const current = get().selected[category] ?? []
        const { max } = categoryById[category]

        if (current.includes(id)) {
          set((s) => ({ selected: { ...s.selected, [category]: current.filter((x) => x !== id) } }))
          return { type: 'removed' }
        }
        // Single-select categories swap the choice instead of blocking.
        if (max === 1 && current.length === 1) {
          set((s) => ({ selected: { ...s.selected, [category]: [id] } }))
          return { type: 'replaced', previousId: current[0] }
        }
        if (current.length >= max) return { type: 'limit', max }

        set((s) => ({ selected: { ...s.selected, [category]: [...current, id] } }))
        return { type: 'added' }
      },

      remove: (category, id) =>
        set((s) => ({
          selected: { ...s.selected, [category]: s.selected[category].filter((x) => x !== id) },
        })),

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
        return { ...current, selected }
      },
    },
  ),
)

export const countSelected = (selected: Selection) =>
  Object.values(selected).reduce((sum, ids) => sum + ids.length, 0)

export const countCategoriesDone = (selected: Selection) =>
  Object.values(selected).filter((ids) => ids.length > 0).length
