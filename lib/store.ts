import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type {} from "@redux-devtools/extension"

interface BearState {
  tokenSearch: boolean
  setTokenSearch: (open: boolean) => void
}

export const useStore = create<BearState>()(
  devtools(
    (set) => ({
      tokenSearch: false,
      setTokenSearch: (open) => set(() => ({ tokenSearch: open })),
    }),
    {
      name: "global-storage",
    }
  )
)
