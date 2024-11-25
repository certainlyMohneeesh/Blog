import { create } from 'zustand'

interface AuthStore {
  showAuth: boolean
  setShowAuth: (show: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  showAuth: false,
  setShowAuth: (show) => set({ showAuth: show }),
}))
