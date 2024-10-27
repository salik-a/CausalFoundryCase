import { create } from "zustand"

const baseInfo = {
  email: "",
  firstName: "",
  lastName: "",
  username: "",
  id: undefined,
  image: undefined,
}

export interface CountStore {
  userInfo: any
  setUserInfo: (info: any) => void
  removeUserInfo: () => void
}

export const useUserStore = create<CountStore>((set) => ({
  userInfo: baseInfo,
  setUserInfo: (info) => set((state) => ({ userInfo: info })),
  removeUserInfo: () => set({ userInfo: baseInfo }),
}))
