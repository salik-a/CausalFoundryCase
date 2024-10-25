import { create } from "zustand"

export interface CountStore {
  count: number
  increaseCounter: () => void
  decreaseCounter: () => void
  increaseCounterByNumber: (number: number) => void
  decreaseCounterByNumber: (number: number) => void
}

export const useCounterStore = create<CountStore>((set) => ({
  count: 0,
  increaseCounter: () => set((state) => ({ count: state.count + 1 })),
  decreaseCounter: () => set((state) => ({ count: state.count - 1 })),
  increaseCounterByNumber: (number) => set((state) => ({ count: state.count + number })),
  decreaseCounterByNumber: (number) => set((state) => ({ count: state.count - number })),
  resetCounter: () => set({ count: 0 }),
}))
