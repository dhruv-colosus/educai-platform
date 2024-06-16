"use client";

import { LoaderCircle, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import truncate from "truncate";
// import { getTokenMetadata, getTopHolders, getUsdPrice } from "@/lib/api"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { nFormatter } from "@/lib/utils";
import { useUsdPrice } from "@/hooks/use-usd-price";
import { useTokenMetadata } from "@/hooks/use-token-metadata";
import { useQuery } from "@tanstack/react-query";
import { TopHolder } from "@/types";
import { useEffect, useState } from "react";

interface TopHoldersProps {
  tokenAddress: string;
}

export function TopHolders({ tokenAddress }: TopHoldersProps) {
  let { data } = useQuery({
    queryKey: ["top-holders", tokenAddress],
    queryFn: (): Promise<TopHolder[]> =>
      fetch("/api/token//top-holders?address=" + tokenAddress)
        .then((res) => res.json())
        .then((data) => data.info),
  });
  let { tokenMetadata } = useTokenMetadata(tokenAddress);
  let { usdPrice } = useUsdPrice(tokenAddress);

  const [remaining, setRemaining] = useState<TopHolder | null>(null);

  const totalSupply = Number(tokenMetadata?.total_supply || 0);
  const top5Supply =
    data?.reduce((acc, d) => acc + Number(d.original_amount), 0) || 0;

  const remainingAmt = totalSupply - top5Supply;
  const remainingFormatted =
    remainingAmt / Math.pow(10, tokenMetadata?.decimals || 0);

  useEffect(() => {
    console.log(data, tokenMetadata);

    if (data && tokenMetadata && data.at(-1)?.wallet_address !== "Remaining") {
      setRemaining({
        wallet_address: "Remaining",
        original_amount: remainingAmt.toString(),
        amount: remainingFormatted.toString(),
        usd_value: (
          remainingFormatted * (tokenMetadata?.current_usd_price || 0)
        ).toString(),
      });
    }
  }, [data, tokenMetadata, remainingAmt, remainingFormatted]);

  return (
    <Card className="bg-foreground @container">
      <CardHeader>
        <CardTitle className="text-muted text-base font-medium flex">
          <Trophy className="me-2" />
          Top Holders
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col py-4 px-6 gap-6">
        {data ? (
          <Table className="min-w-[700px]">
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">Address</TableHead>
                <TableHead className="text-center">Supply</TableHead>
                <TableHead className="text-center">Amount</TableHead>
                <TableHead className="text-center">Value USD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-muted font-semibold">
              {[...data, remaining]
                .flatMap((x) => x ?? [])
                .map((row) => (
                  <TableRow key={row.wallet_address}>
                    <TableCell className="">
                      {truncate(row.wallet_address, 16)}
                    </TableCell>
                    <TableCell className="flex gap-1 items-center justify-start">
                      <p className="w-14">
                        {(
                          (100 * Number(row.original_amount)) /
                          totalSupply
                        ).toFixed(2)}{" "}
                        %
                      </p>
                      <div className="w-[250px] h-2 relative z-0 -translate-y-1/4">
                        <div
                          className="bg-accent h-full absolute -z-10"
                          style={{
                            width:
                              (
                                (100 * Number(row.original_amount)) /
                                totalSupply
                              ).toFixed(0) + "%",
                          }}
                        ></div>
                        <div className="w-full bg-accent opacity-50 h-full absolute -z-20"></div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {nFormatter(Number(row.amount))}
                    </TableCell>
                    <TableCell className="text-end">
                      ${/* @ts-ignore */}
                      {(Number(row.amount) * (usdPrice?.usdPrice || 0)).toFixed(
                        2
                      )}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ) : (
          <div className="mx-auto mb-4">
            <LoaderCircle className="animate-spin" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// const defaultTopHolders: TopHolder[] = [
//   {
//     amount: "2604091.189516076",
//     original_amount: "2604091189516076",
//     usd_value: "0.000000",
//     wallet_address: "0xd4a86393d79f7715374d179ec4bb43ab5b941451",
//   },
//   {
//     amount: "650000.000000000",
//     original_amount: "650000000000000",
//     usd_value: "0.000000",
//     wallet_address: "0x4772cfedbbe865aa6d5c505974b253602e8256fb",
//   },
//   {
//     amount: "213001.808238746",
//     original_amount: "213001808238746",
//     usd_value: "0.000000",
//     wallet_address: "0x2e644809e9eece3b1112061a045987df160597cc",
//   },
//   {
//     amount: "170995.528713125",
//     original_amount: "170995528713125",
//     usd_value: "0.000000",
//     wallet_address: "0x603ad55997c090a05c53a6b5c9de4fd40d872dbd",
//   },
//   {
//     amount: "165800.950819375",
//     original_amount: "165800950819375",
//     usd_value: "0.000000",
//     wallet_address: "0x5f4677560b51f7892a1d6f38d0e920f57093786d",
//   },
// ]

// const defaultMetadata: TokenMetadata = {
//   name: "name",
//   decimals: 3,
//   symbol: "SYM",
//   total_supply: 1,
//   current_usd_price: 1,
// }
