import { authOptions } from "@/config";
import { AiInsight } from "@/components/ai-insight";
import { BalanceFluctuation } from "@/components/balance-fluctuation";
import { Holdings } from "@/components/holdings";
import { RecentTransactions } from "@/components/recent-transactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPercentChange } from "@/lib/balance";
import { getEthPrice } from "@/lib/serv-utils";
import { getSessionUser, getUserId } from "@/lib/sess";
import { nFormatter } from "@/lib/utils";
import prisma from "@/prisma/db";
import { CreditCard, Eye, PlusCircle, TrendingUp } from "lucide-react";
import { Welcome } from "@/components/welcome";
// import { getUsdPrice } from "@/lib/api"
import { Decimal } from "@prisma/client/runtime/library";

export default function UserDashboard() {
  return (
    <div className="flex flex-col @container gap-4">
      <Welcome />
      <div className="grid @lg:grid-cols-2 @6xl:grid-cols-4 gap-4">
        <Balance />
        <NumTrades />
        <WinLoss />
        <TypesOfTokens />
      </div>
      <div className="flex gap-4 flex-col lg:flex-row">
        <div className="flex-[2]">
          <BalanceFluctuation />
        </div>
        <div className="flex-1">
          <AiInsight />
        </div>
      </div>
      <Holdings />
      <RecentTransactions />
    </div>
  );
}

async function Balance() {
  const user = await getSessionUser({ balance: true });
  const { percent } = await getPercentChange(user.id);

  const balanceETH = user.balance.div(new Decimal(10).pow(18));
  //@ts-ignore
  const ethPrice = await getEthPrice();
  const balanceUSD = balanceETH.mul(ethPrice);

  return (
    <Card className="bg-foreground w-full px-4">
      <CardHeader>
        <CardTitle className="text-muted text-base font-medium flex">
          <Eye className="me-2" />
          Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-3 items-center">
        <p className="text-2xl font-semibold">
          {balanceETH.toSignificantDigits(4).toNumber()} ETH ($
          {nFormatter(balanceUSD.toNumber())})
        </p>
        {/* <div className="flex items-center gap-1 h-fit px-1 text-green-300 bg-green-600 bg-opacity-50 border-green-300 rounded-sm border-[1px] border-opacity-50 text-sm font-medium">
          {percent}% <TrendingUp size={14} />
        </div> */}
      </CardContent>
    </Card>
  );
}

async function NumTrades() {
  const user = await getSessionUser({ balance: true });
  const numTrades = await prisma.order.count({ where: { userId: user.id } });

  return (
    <Card className="bg-foreground w-full px-4">
      <CardHeader>
        <CardTitle className="text-muted text-base font-medium flex">
          <CreditCard className="me-2" />
          No. of Trades
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <p className="text-2xl font-semibold">{numTrades}</p>
      </CardContent>
    </Card>
  );
}

async function WinLoss() {
  const user = await getSessionUser({});
  const { amount } = await getPercentChange(user.id);

  return (
    <Card className="bg-foreground w-full px-4">
      <CardHeader>
        <CardTitle className="text-muted text-base font-medium flex">
          <PlusCircle className="me-2" />
          Win/Loss in last 24hrs
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <p className="text-2xl font-semibold text-green-400">
          +{nFormatter(amount)} USD
        </p>
      </CardContent>
    </Card>
  );
}

async function TypesOfTokens() {
  const userId = await getUserId();
  const numTokens = await prisma.tokenBalance.count({ where: { userId } });

  return (
    <Card className="bg-foreground w-full px-4">
      <CardHeader>
        <CardTitle className="text-muted text-base font-medium flex">
          <PlusCircle className="me-2" />
          Types Of Tokens
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <p className="text-2xl font-semibold">{numTokens}</p>
      </CardContent>
    </Card>
  );
}
