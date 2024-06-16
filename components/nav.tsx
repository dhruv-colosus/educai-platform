"use client"

import Image from "next/image"
import {
  User,
  Home,
  DollarSign,
  CandlestickChart,
  Menu,
  LogOut,
} from "lucide-react"
import { SearchInput } from "./ui/search-input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/nav-accordion"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useWindowSize } from "@uidotdev/usehooks"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { useEffect, useState } from "react"
import Avatar from "boring-avatars"
import { SessionProvider, signOut, useSession } from "next-auth/react"
import truncate from "truncate"
import { useStore } from "@/lib/store"

const Nav = () => {
  let { width } = useWindowSize()
  if (!width) width = 640

  return width >= 1200 ? <DesktopNav /> : <MobileNav />
}

const MobileNav = () => {
  let { width } = useWindowSize()
  const pathname = usePathname()
  const [navOpen, setNavOpen] = useState(false)
  const { data, status } = useSession()

  const username = data?.user?.email?.split("@")[0] ?? ""

  if (!width) width = 640

  return (
    <div className="w-screen h-16 border-foreground border-b shadow-xl p-4 flex justify-between items-center">
      <div className="">
        <Image src="/logo.png" alt="EducAI" width={100} height={30} />
      </div>
      <div>
        <div className="flex gap-8 items-center">
          {width >= 850 ? (
            <>
              {links.map((link) => (
                <Link
                  href={link.path}
                  key={link.path}
                  className={`${
                    link.path === pathname ? "text-accent" : "text-muted"
                  }`}
                >
                  {link.text}
                </Link>
              ))}
              <div className="bg-foreground w-[1px] h-16"></div>
              {status === "authenticated" && data !== null ? (
                <div className="flex gap-2 items-center">
                  <Avatar name={username} variant="beam" size={28} />
                  <div className="flex flex-col">
                    <p> {truncate(username, 24)}</p>
                  </div>
                  <div className="flex-1"></div>
                  <button
                    className="p-4 hover:scale-110 transition-transform cursor-pointer"
                    onClick={() => signOut()}
                  >
                    <LogOut className="inline" size={20} />
                  </button>
                </div>
              ) : (
                <Link href="/api/auth/signin" className="w-fit mx-auto">
                  <div className="py-2 px-4 font-medium bg-accent rounded-lg">
                    Sign In
                  </div>
                </Link>
              )}
            </>
          ) : (
            <>
              <Menu
                className="cursor-pointer hover:scale-110 transition-transform"
                onClick={() => setNavOpen(true)}
              />
              <Sheet open={navOpen} onOpenChange={setNavOpen}>
                <SheetContent side="left" className="bg-background">
                  <SheetHeader>
                    <SheetTitle>
                      <Image
                        src="/logo.png"
                        alt="EducAI"
                        width={100}
                        height={30}
                      />
                      <div className="text-muted-foreground font-normal pt-6 flex flex-col items-start gap-3 text-lg flex-1">
                        {links.map((link) => (
                          <Link
                            href={link.path}
                            key={link.path}
                            className={`${
                              link.path === pathname
                                ? "text-accent"
                                : "text-muted"
                            }`}
                            onClick={() => setNavOpen(false)}
                          >
                            {link.text}
                          </Link>
                        ))}
                        <div className="flex-1"></div>
                        {status === "authenticated" && data !== null ? (
                          <div className="flex gap-2 items-center">
                            <Avatar name={username} variant="beam" />
                            <div className="flex flex-col">
                              <p> {truncate(username, 24)}</p>
                            </div>
                            <div className="flex-1"></div>
                            <button
                              className="p-4 hover:scale-110 transition-transform cursor-pointer"
                              onClick={() => signOut()}
                            >
                              <LogOut className="inline" size={20} />
                            </button>
                          </div>
                        ) : (
                          <Link
                            href="/api/auth/signin"
                            className="w-fit mx-auto"
                          >
                            <div className="py-2 px-4 font-medium bg-accent rounded-lg text-white">
                              Sign In
                            </div>
                          </Link>
                        )}
                      </div>
                    </SheetTitle>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const DesktopNav = () => {
  const pathname = usePathname()
  const { data, status } = useSession()
  const setTokenStorage = useStore((store) => store.setTokenSearch)
  const username = data?.user?.email?.split("@")[0] ?? ""

  return (
    <div className="w-[320px] flex-shrink-0 p-6 flex flex-col gap-6 shadow-xl border-r border-foreground h-screen overflow-x-hidden">
      <div className="flex justify-between items-center">
        <Image src="/logo.png" alt="EducAI" width={100} height={30} />
      </div>
      <SearchInput
        className="bg-foreground text-xs"
        placeholder="Search for tokens, name, symbol"
        onClick={() => setTokenStorage(true)}
      />
      <Accordion type="single" collapsible value={pathname}>
        {links.map((link) => (
          <AccordionItem value={link.path} key={link.path}>
            <Link href={link.path}>
              <AccordionTrigger
                className={` ${
                  pathname === link.path ? "text-accent" : "text-muted"
                } hover:no-underline`}
              >
                <div>
                  <link.icon className="mr-2" />
                </div>
                {link.text}
                <div className="flex-1"></div>
              </AccordionTrigger>
            </Link>
            <AccordionContent
              className={`flex flex-col px-3 gap-2 text-muted ${
                link.children.length === 0 ? "pb-0" : ""
              }`}
            >
              {link.children.map((childLink) => (
                <Link href={childLink.path} key={childLink.path}>
                  {childLink.text}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div className="flex-1"></div>
      <div className="h-[1px] scale-x-150 bg-foreground w-full"></div>
      {status === "authenticated" && data !== null ? (
        <div className="flex gap-2 items-center">
          <Avatar name={username} variant="beam" />
          <div className="flex flex-col">
            <p> {truncate(username ?? "", 24)}</p>
          </div>
          <div className="flex-1"></div>
          <button
            className="p-4 hover:scale-110 transition-transform cursor-pointer"
            onClick={() => signOut()}
          >
            <LogOut className="inline" size={20} />
          </button>
        </div>
      ) : (
        <Link href="/api/auth/signin" className="w-fit mx-auto">
          <div className="py-2 px-4 font-medium bg-accent rounded-lg">
            Sign In
          </div>
        </Link>
      )}
    </div>
  )
}

const links = [
  {
    path: "/user",
    text: "Home",
    icon: Home,
    children: [
      { path: "#educational", text: "Educational Videos" },
      { path: "#recent-tokens", text: "Recent Tokens" },
      { path: "#trending", text: "Trending Tokens" },
      { path: "#recent-lp", text: "Recent LP locks/burns" },
    ],
  },
  {
    path: "/user/pair-explorer",
    text: "Pair Explorer",
    icon: CandlestickChart,
    children: [
      { path: "#contract-scan", text: "Contract Scan" },
      { path: "#orderbook", text: "Orderbook" },
      { path: "#top-holders", text: "Top Holders" },
      { path: "#swap", text: "Swap" },
    ],
  },
  {
    path: "/user/dashboard",
    text: "Dashboard",
    icon: User,
    children: [
      { path: "#balance", text: "Basic Info" },
      { path: "#balance-fluctuation", text: "Balance Fluctuation" },
      { path: "#ai-insight", text: "AI Insight and Advices" },
      { path: "#holdings", text: "Your Holdings" },
      { path: "#recent-tx", text: "Recent Trasactions" },
    ],
  },
  {
    path: "/user/pricing",
    text: "Pricing",
    icon: DollarSign,
    children: [],
  },
]

export default Nav
