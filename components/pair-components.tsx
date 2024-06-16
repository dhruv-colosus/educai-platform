"use client"

import {
  BarChart2,
  Github,
  Instagram,
  Star,
  Twitter,
  Weight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { nFormatter } from "@/lib/utils"
import { useTokenMetadata } from "@/hooks/use-token-metadata"
import { useUsdPrice } from "@/hooks/use-usd-price"

export function TokenBox({ tokenAddress }: { tokenAddress: string }) {
  const { tokenMetadata } = useTokenMetadata(tokenAddress)

  return (
    <Card className="bg-foreground w-full px-4 @lg:col-span-2">
      <CardContent className="flex items-center h-full w-full justify-between pt-6 flex-col @xs:flex-row">
        <div className="p-4">
          <p className="font-bold text-2xl">{tokenMetadata?.name || "-"}</p>
          <p className="text-muted text-sm font-medium">
            {tokenMetadata?.symbol || "-"}
          </p>
        </div>
        <div className="flex gap-4 flex-col @xs:flex-row items-center">
          <div className="border rounded-xl py-2 px-4 gap-4 flex text-sm opacity-75">
            <Instagram />
            <Twitter />
            <Github />
          </div>
          <Star />
        </div>
      </CardContent>
    </Card>
  )
}

export function MarketCap({ tokenAddress }: { tokenAddress: string }) {
  const { tokenMetadata } = useTokenMetadata(tokenAddress)

  const { usdPrice } = useUsdPrice(tokenAddress)

  console.log(tokenMetadata, usdPrice)

  return (
    <Card className="bg-foreground w-full px-4">
      <CardHeader>
        <CardTitle className="text-muted text-base font-medium flex">
          <BarChart2 className="me-2" />
          Market Cap
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <p className="text-2xl font-semibold">
          $
          {tokenMetadata
            ? nFormatter(
                (tokenMetadata.total_supply * (usdPrice || 0)) /
                  Math.pow(10, tokenMetadata.decimals)
              )
            : "-"}
        </p>
      </CardContent>
    </Card>
  )
}

export function Volume({ tokenAddress }: { tokenAddress: string }) {
  // TODO replace total supply with volume
  const { tokenMetadata } = useTokenMetadata(tokenAddress)

  return (
    <Card className="bg-foreground w-full px-4">
      <CardHeader>
        <CardTitle className="text-muted text-base font-medium flex">
          <Weight className="me-2" />
          Total Supply
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <p className="text-2xl font-semibold">
          {tokenMetadata
            ? nFormatter(
                tokenMetadata.total_supply /
                  Math.pow(10, tokenMetadata.decimals)
              )
            : "-"}
        </p>
      </CardContent>
    </Card>
  )
}
