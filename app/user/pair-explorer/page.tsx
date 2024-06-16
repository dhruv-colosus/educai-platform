"use server";

import { ContractScan } from "@/components/contract-scan";
import { Orderbook } from "@/components/orderbook";
import { OrderbookWrapper } from "@/components/orderbook-wrapper";
import { MarketCap, TokenBox, Volume } from "@/components/pair-components";
import { SearchTokenPage } from "@/components/search-token-page";
import { Swap } from "@/components/swap";
import { TokenChart } from "@/components/token-chart";
import { TopHolders } from "@/components/top-holders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Welcome } from "@/components/welcome";
// import { getTokenMetadata, getUsdPrice } from "@/lib/api"
import { nFormatter } from "@/lib/utils";
import { OrderbookOption } from "@/types";
import {
  BarChart2,
  Github,
  Instagram,
  Star,
  Twitter,
  Weight,
} from "lucide-react";
import { Suspense } from "react";

interface PairExplorerProps {
  searchParams?: {
    tokenAddress?: string;
    page?: number;
    orders?: string;
  };
}

export default async function PairExplorer({
  searchParams,
}: PairExplorerProps) {
  const page = searchParams?.page || 0;
  const tokenAddress = searchParams?.tokenAddress; // || "0x36c79f0b8a2e8a3c0230c254c452973e7a3ba155"
  const orders =
    searchParams?.orders === OrderbookOption.Personal
      ? OrderbookOption.Personal
      : OrderbookOption.All;

  console.log(tokenAddress);

  if (!tokenAddress || tokenAddress === "") {
    return <SearchTokenPage />;
  }

  return (
    <div className="flex flex-col @container">
      <Welcome />
      <div className="flex justify-between mt-6 gap-4 flex-col @5xl:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <div className="grid max-w-full min-w-0 @lg:grid-cols-2 @6xl:grid-cols-4 gap-4">
            <TokenBox tokenAddress={tokenAddress} />
            <MarketCap tokenAddress={tokenAddress} />
            <Volume tokenAddress={tokenAddress} />
          </div>
          <TokenChart tokenAddress={tokenAddress} />
          <OrderbookWrapper tokenAddress={tokenAddress} />
          <TopHolders tokenAddress={tokenAddress} />
        </div>
        <div className="flex flex-col gap-4">
          <ContractScan tokenAddress={tokenAddress} />
          <Swap tokenAddress={tokenAddress} />
        </div>
      </div>
    </div>
  );
}
