"use client"

import { useStore } from "@/lib/store"
import { useDebounce } from "@uidotdev/usehooks"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { Input } from "./ui/input"
import { BasicTokenInfo } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"

export const SearchToken = () => {
  const [search, setSearch] = useState("")

  const debouncedSearch = useDebounce(search, 500)
  const { tokenSearch, setTokenSearch } = useStore()

  const [tokens, setTokens] = useState<BasicTokenInfo[]>([])

  const router = useRouter()

  useEffect(() => {
    if (debouncedSearch === "") {
      setTokens([])
    } else {
      const abortC = new AbortController()
      fetch("/api/token/search?name=" + debouncedSearch, {
        signal: abortC.signal,
      })
        .then((res) => res.json())
        .then((data) => {
          setTokens(data)
        })

      return () => abortC.abort()
    }
  }, [debouncedSearch])

  return (
    <Dialog open={tokenSearch} onOpenChange={setTokenSearch}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center mb-4">Search Token</DialogTitle>
          <DialogDescription className="flex flex-col items-center text-center">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter token name, symbol, address"
            />
            <div className="mt-4 flex flex-col gap-2">
              {tokens.map((token, idx) => (
                <div
                  key={token.address}
                  className="flex items-center gap-2  cursor-pointer"
                  onClick={() => {
                    router.push("/user/pair-explorer?tokenAddress=" + token.address)
                    setTokenSearch(false)
                  }}
                >
                  <div className="w-4 h-4 overflow-hidden rounded-full">
                    <Image
                      src={token.logoURI}
                      alt="Token Logo"
                      width={24}
                      height={24}
                    />
                  </div>
                  <p>
                    {token.name} ({token.symbol})
                  </p>
                </div>
              ))}
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
