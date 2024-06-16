"use server";

import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { getTrendingTokens } from "@/lib/api";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

export async function TrendingTokens() {
  //@ts-ignore
  const data = await getTrendingTokens();

  return (
    <Card className="bg-foreground w-full px-4 @container">
      <CardHeader>
        <CardTitle className="text-muted text-lg font-medium flex">
          <TrendingUp className="me-2" />
          Trending Tokens
        </CardTitle>
      </CardHeader>
      <CardContent className="-mx-4 @lg:mx-4">
        <Table className="min-w-[500px]">
          <TableBody>
            {data.slice(0, 6).map((row, idx) => (
              <TableRow key={idx} className="font-medium">
                <TableCell className="text-start">{idx + 1}.</TableCell>
                <TableCell className="text-center">
                  {row.token_name} ({row.token_symbol})
                </TableCell>
                <TableCell className="text-center text-green-400 text-lg">
                  ${row.price_usd}
                </TableCell>
                <TableCell className="flex justify-end text-end">
                  <p
                    className={`w-fit flex items-center bg-opacity-20 p-1 rounded-lg border-[1px] border-green-400 border-opacity-30 text-sm ${
                      Number(row.price_24h_percent_change) >= 0
                        ? "text-green-400 bg-green-500"
                        : "text-red-400 bg-red-500"
                    }`}
                  >
                    {Number(row.price_24h_percent_change).toFixed(2)}%&nbsp;
                    {Number(row.price_24h_percent_change) >= 0 ? (
                      <TrendingUp className="inline" size={14} />
                    ) : (
                      <TrendingDown className="inline" size={14} />
                    )}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      {/* <CardContent className="grid grid-cols-6 gap-y-4 gap-x-4 items-center">
        {Array(5)
          .fill(5)
          .map((_, idx) => (
            <Fragment key={idx}>
              <p className="text-lg font-medium">{idx + 1}.</p>
              <p className="text-medium font-medium col-span-2 justify-self-start">
                <Spade className="mr-1 inline" /> $BAI /{" "}
                <span className="text-xs opacity-70 font-normal">WETH</span>
              </p>
              <p className=" text-green-400 text-center col-span-2">$0.0242</p>
              <p className="text-green-400 flex items-center bg-green-500 bg-opacity-20 p-1 rounded-lg border-[1px] border-green-400 border-opacity-30 text-sm">
                2843.4$&nbsp;
                <TrendingUp className="inline" size={14} />
              </p>
            </Fragment>
          ))}
      </CardContent> */}
    </Card>
  );
}
