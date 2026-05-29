import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SelectionState {
  selected: string[] // slugs
  toggle: (slug: string) => void
  add: (slug: string) => void
  remove: (slug: string) => void
  clear: () => void
  has: (slug: string) => boolean
}

export const useSelection = create<SelectionState>()(
  persist(
    (set, get) => ({
      selected: [],
      toggle: (slug) =>
        set((s) => ({
          selected: s.selected.includes(slug)
            ? s.selected.filter((x) => x !== slug)
            : [...s.selected, slug],
        })),
      add: (slug) =>
        set((s) => ({
          selected: s.selected.includes(slug)
            ? s.selected
            : [...s.selected, slug],
        })),
      remove: (slug) =>
        set((s) => ({ selected: s.selected.filter((x) => x !== slug) })),
      clear: () => set({ selected: [] }),
      has: (slug) => get().selected.includes(slug),
    }),
    { name: 'hookit-selection' }
  )
)
