"use server"

import { Calendar, Coins, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { FluctuationChart } from "./fluctuation-chart"

export async function BalanceFluctuation() {
  return (
    <Card className="bg-foreground w-full px-4 @container">
      <CardHeader>
        <CardTitle className="text-muted text-base font-medium flex">
          <Coins className="mr-2" /> Balance Fluctuations
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 items-center -mx-4 @sm:mx-0">
        <div className="flex flex-col @sm:flex-row gap-4 justify-between items-center w-full">
          <div className="flex flex-col @sm:flex-row items-center gap-2">
            <p className="text-2xl font-semibold">$103.45K</p>
            <div className="w-fit flex items-center justify-center gap-1 h-fit px-1 text-green-300 bg-green-600 bg-opacity-50 border-green-300 rounded-sm border-[1px] border-opacity-50 text-sm font-medium">
              28.4%
              <TrendingUp size={14} />
            </div>
          </div>
          <div className="grid gap-2 grid-cols-2 @2xl:grid-cols-4">
            <button className="bg-foreground brightness-150 py-2 px-3 rounded-lg text-xs cursor-pointer">
              <Calendar className="me-1 inline text-muted" size={12} /> 1 Day
            </button>
            <button className="bg-foreground brightness-150 py-2 px-3 rounded-lg text-xs cursor-pointer">
              <Calendar className="me-1 inline text-muted" size={12} /> 1 Week
            </button>
            <button className="bg-foreground brightness-150 py-2 px-3 rounded-lg text-xs cursor-pointer">
              <Calendar className="me-1 inline text-muted" size={12} /> 1 Month
            </button>
            <button className="bg-foreground brightness-150 py-2 px-3 rounded-lg text-xs cursor-pointer">
              <Calendar className="me-1 inline text-muted" size={12} /> 3 Months
            </button>
          </div>
        </div>
        <FluctuationChart />
      </CardContent>
    </Card>
  )
}
