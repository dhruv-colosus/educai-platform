import { ArrowUpFromLine, Copy, Percent, Spade } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Fragment } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"

export function LpData() {
  return (
    <Card className="bg-foreground w-full px-4">
      <CardHeader>
        <CardTitle className="text-muted text-lg font-medium flex">
          <Percent className="me-2" />
          Recent LP locks/burns
        </CardTitle>
      </CardHeader>
      <CardContent className="@container px-0 -mx-4">
        <Table className="min-w-[350px]">
          <TableHeader>
            <TableRow className="text-lg">
              <TableHead className="text-start text-muted ps-8">
                Token Pair
              </TableHead>
              <TableHead className="text-end text-muted pe-8">
                Liquidity to Unlock
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5)
              .fill(null)
              .map((row, idx) => (
                <TableRow
                  key={idx}
                  className={`${idx % 2 == 0 ? "bg-background" : ""}`}
                >
                  <TableCell className="text-start ps-8 flex gap-2 items-center my-2">
                    <div className="rounded-full w-8 h-8 flex items-center justify-center bg-gray-700">
                      B
                    </div>
                    <div className="flex flex-col gap-1">
                      <div>
                        <p className="text-medium font-medium col-span-2 justify-self-start">
                          $BAI
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                        <div>0x82.....1</div>
                        <Copy size={12} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className=" pe-8">
                    <div className="w-16 @xs:w-28 font-medium py-1 rounded-sm bg-green-500 text-center ms-auto">
                      97.4%
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
