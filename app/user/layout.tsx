"use client"

import Nav from "@/components/nav"
import { SearchToken } from "@/components/search-token"
import { useStore } from "@/lib/store"
import { useWindowSize } from "@uidotdev/usehooks"

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  let { width } = useWindowSize()
  if (!width) width = 640

  const tokenSearch = useStore((store) => store.tokenSearch)

  return (
    <div className={`flex ${width < 1200 ? "flex-col" : ""} h-full`}>
      <Nav />
      <main className="flex-1 p-4 sm:p-8 overflow-x-hidden overflow-y-auto">
        {children}
        <SearchToken />
      </main>
    </div>
  )
}
