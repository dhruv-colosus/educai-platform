import { ArrowUpFromLine, Spade } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Fragment } from "react"
import { Table, TableBody, TableCell, TableRow } from "./ui/table"

export function RecentlyDeployed() {
  return (
    <Card className="bg-foreground w-full px-4 @container">
      <CardHeader>
        <CardTitle className="text-muted text-lg font-medium flex">
          <ArrowUpFromLine className="me-2" />
          Recently Deployed Tokens
        </CardTitle>
      </CardHeader>
      <CardContent className="-mx-4 @md:mx-4">
        <Table className="min-w-[240px]">
          <TableBody>
            {Array(5)
              .fill(null)
              .map((row, idx) => (
                <TableRow key={idx} className="font-medium">
                  <TableCell className="text-start">{idx + 1}.</TableCell>
                  <TableCell className="text-start text-lg w-full ps-2">BetAI <span className="text-muted text-sm">(BAI)</span></TableCell>
                  <TableCell className="text-end text-green-400 text-lg">
                    $0.0423
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {/* {Array(5)
          .fill(5)
          .map((_, idx) => (
            <Fragment key={idx}>
              <p className="text-lg font-medium">{idx + 1}.</p>
              <p className="text-medium font-medium col-span-2 justify-self-start">
                <Spade className="mr-1 inline" /> $BAI /{" "}
                <span className="text-xs opacity-70 font-normal">WETH</span>
              </p>
              <p className=" text-green-400 text-center col-span-2 justify-self-end">
                $0.0242
              </p>
            </Fragment>
          ))} */}
      </CardContent>
    </Card>
  )
}
