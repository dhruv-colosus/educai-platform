"use client"

import { useDebounce } from "@uidotdev/usehooks"
import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { useStore } from "@/lib/store"

export const SearchTokenPage = () => {
  const [search, setSearch] = useState("")

  const debouncedSearch = useDebounce(search, 500)
  const setTokenStorage = useStore((store) => store.setTokenSearch)

  useEffect(() => {}, [debouncedSearch])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-4">Search Token</h2>
      <Input
        placeholder="Search for tokens, name, symbol"
        className="max-w-[420px]"
        onClick={() => setTokenStorage(true)}
      />
    </div>
  )
}
