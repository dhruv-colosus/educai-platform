"use server"

import { Card, CardContent } from "./ui/card"
import { getHistoricPrice } from "@/lib/api"

interface TokenChartProps {
  tokenAddress: string
}

export async function TokenChart({ tokenAddress }: TokenChartProps) {
  // const historicPrice = await getHistoricPrice(tokenAddress)
  // console.log("historic", tokenAddress, historicPrice)

  return (
    <Card className="bg-foreground w-full px-4 h-[200px]">
      <CardContent className="flex items-center justify-center h-full font-bold text-xlte">
        Token Chart
      </CardContent>
    </Card>
    // <Card className="bg-foreground w-full px-4">
    //   <CardContent className="flex items-center justify-center h-full font-bold text-xlte">
    //     <iframe
    //       id="dextswap-aggregator-widget"
    //       title="DEXTswap Aggregator"
    //       width="400"
    //       height="420"
    //       src={`https://www.dextools.io/widget-aggregator/en/swap/eth/${tokenAddress}`}
    //     ></iframe>
    //   </CardContent>
    // </Card>
  )
}
