"use client"

import { Card, CardContent } from "./ui/card"
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useDeferredValue,
  useEffect,
  useState,
} from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { OrderbookOption } from "@/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Orderbook } from "./orderbook"

export function OrderbookWrapper({ tokenAddress }: { tokenAddress: string }) {
  const [option, setOption] = useState<OrderbookOption>(OrderbookOption.All)
  const [page, setPage] = useState(0)

  const changePage = (newPage: number) => {
    setPage(Math.max(0, newPage))
  }

  const changeOptionType = (newType: OrderbookOption) => {
    setOption(newType)
  }

  return (
    <Card className="bg-foreground @container">
      <CardContent className="flex flex-col py-4 px-6 gap-6">
        <div className="flex gap-4 flex-col @xs:flex-row text-center">
          <OrderbookButton
            text="All Transactions"
            option={option}
            selfOption={OrderbookOption.All}
            setOption={changeOptionType}
          />
          <OrderbookButton
            text="My Transactions"
            option={option}
            selfOption={OrderbookOption.Personal}
            setOption={changeOptionType}
          />
        </div>
        <Orderbook tokenAddress={tokenAddress} page={page} option={option} />
        <div className="self-end items-center flex gap-4 -mt-4">
          <div
            className="p-2 bg-background rounded-lg cursor-pointer"
            onClick={() => changePage(page - 1)}
          >
            <ChevronLeft size={16} />
          </div>
          <p className="w-4 text-center font-bold">{page}</p>
          <div
            className="p-2 bg-background rounded-lg cursor-pointer"
            onClick={() => changePage(page + 1)}
          >
            <ChevronRight size={16} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface OrderbookButtonProps {
  text: string
  option: OrderbookOption
  selfOption: OrderbookOption
  setOption: (opt: OrderbookOption) => void
}

function OrderbookButton({
  text,
  option,
  selfOption,
  setOption,
}: OrderbookButtonProps) {
  return (
    <div
      className={`p-2 text-muted rounded-lg cursor-pointer px-4 text-sm hover:scale-105 transition-transform ${
        option === selfOption ? `brightness-125 bg-foreground` : "bg-background"
      }`}
      onClick={() => setOption(selfOption)}
    >
      {text}
    </div>
  )
}
