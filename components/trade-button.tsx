"use client"

import { useRouter } from "next/navigation"

export const TradeButton = ({ addr }: { addr: string }) => {
  const router = useRouter()
  return (
    <button
      className="py-1 px-4 bg-accent text-center w-20 rounded-md font-medium"
      onClick={() => router.push("/user/pair-explorer?tokenAddress=" + addr)}
    >
      Trade
    </button>
  )
}
