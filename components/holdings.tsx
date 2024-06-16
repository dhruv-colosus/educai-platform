import { PieChart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { getUserId } from "@/lib/sess"
import prisma from "@/prisma/db"
import { nFormatter } from "@/lib/utils"
import { Decimal } from "@prisma/client/runtime/library"
import { TradeButton } from "./trade-button"
import { useUsdPrice } from "@/hooks/use-usd-price"
import { getMidPrice } from "@/lib/router"

export async function Holdings() {
  const userId = await getUserId()
  const holdings = (await prisma.user.findUnique({
    where: { id: userId },
    select: {
      TokenBalance: {
        include: { token: true },
      },
    },
  }))!.TokenBalance

  return (
    <Card className="bg-foreground w-full px-4">
      <CardHeader>
        <CardTitle className="text-muted text-lg font-medium flex">
          <PieChart className="me-2" />
          Your Holdings
        </CardTitle>
      </CardHeader>
      <CardContent className="@container px-0 -mx-4">
        {holdings.length === 0 ? (
          <p className="w-fit mx-auto px-4">No holdings</p>
        ) : (
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="text-lg">
                <TableHead className="text-start text-muted ps-8">
                  Token
                </TableHead>
                <TableHead className="text-center text-muted">Amount</TableHead>
                <TableHead className="text-center text-muted">
                  Token Value
                </TableHead>
                <TableHead className="text-center text-muted">
                  Current Price
                </TableHead>

                <TableHead className="text-center text-muted pe-8">
                  DCA Price
                </TableHead>
                {/* <TableHead className="text-end text-muted">
                Liquidity to Unlock
              </TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {await Promise.all(
                holdings.map(async (holding, idx) => {
                  const tokenPrice = await getMidPrice(holding.tokenAddress)
                  return (
                    <TableRow
                      key={idx}
                      className={`${idx % 2 == 0 ? "bg-background" : ""}`}
                    >
                      <TableCell className="text-start ps-8 py-4">
                        {holding.token.name} ({holding.token.symbol})
                      </TableCell>
                      <TableCell className="text-center">
                        {nFormatter(
                          holding.balance
                            .div(new Decimal(10).pow(holding.token.decimals))
                            .toNumber()
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        $
                        {holding.balance
                          .div(new Decimal(10).pow(holding.token.decimals))
                          .mul(new Decimal(tokenPrice.usd))
                          .toSD(6)
                          .toString()}
                      </TableCell>
                      <TableCell className="text-center">
                        ${new Decimal(tokenPrice.usd).toSD(6).toString()}
                      </TableCell>
                      <TableCell className="text-center">$-</TableCell>
                      <TableCell className="pe-8 flex justify-center">
                        <TradeButton addr={holding.tokenAddress} />
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
