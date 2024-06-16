import { BadgeDollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { getSessionUser, getUserId } from "@/lib/sess"
import { OrderType } from "@prisma/client"
import { getTokenInfoBasic } from "@/lib/api"
import { nFormatter } from "@/lib/utils"
import prisma from "@/prisma/db"
import { Decimal } from "@prisma/client/runtime/library"

export async function RecentTransactions() {
  const userId = await getUserId()
  const orders = (await prisma.user.findUnique({
    where: { id: userId },
    select: {
      Order: { include: { token: true }, orderBy: { createdAt: "desc" } },
    },
  }))!.Order.slice(0, 5)

  return (
    <Card className="bg-foreground w-full px-4">
      <CardHeader>
        <CardTitle className="text-muted text-lg font-medium flex">
          <BadgeDollarSign className="me-2" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="@container px-0 -mx-4">
        {orders.length === 0 ? (
          <p className="mx-auto px-4 w-fit">No Transactions</p>
        ) : (
          <Table className="min-w-[800px]">
            <TableHeader>
              <TableRow className="text-lg">
                <TableHead className="text-start text-muted ps-8">
                  Token
                </TableHead>
                <TableHead className="text-center text-muted">Amount</TableHead>
                <TableHead className="text-center text-muted">
                  Price per Token
                </TableHead>
                <TableHead className="text-center text-muted">
                  Current Price
                </TableHead>
                <TableHead className="text-center text-muted pe-8">
                  DCA Price
                </TableHead>
                <TableHead className="text-end text-muted pe-8">
                  Transaction ID
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, idx) => (
                <TableRow
                  key={idx}
                  className={`${
                    order.type === OrderType.BUY ? "bg-green-500" : "bg-red-500"
                  } bg-opacity-30`}
                >
                  <TableCell className="text-start ps-8 py-4">
                    {order.token.name} ({order.token.symbol})
                  </TableCell>
                  <TableCell className="text-center">
                    {nFormatter(
                      (order.type === OrderType.BUY ? order.out : order.in)
                        .div(new Decimal(10).pow(order.token.decimals))
                        .toNumber()
                    )}
                  </TableCell>
                  <TableCell className="text-center">$-</TableCell>
                  <TableCell className="text-center">$-</TableCell>
                  <TableCell className="text-center">$-</TableCell>
                  <TableCell className="pe-8 text-end">{order.id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
