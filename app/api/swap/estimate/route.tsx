import { SwapType } from "@uniswap/smart-order-router"
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core"
// import { provider } from "@/lib/eth"
import { getEstimate, getTokenMetadata, hasBalance } from "@/lib/api"
import { Protocol } from "@uniswap/router-sdk"
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/config"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const amount = searchParams.get("amount")
  const session = await getServerSession(authOptions)

  if (!from || !to || !amount || !session) {
    return NextResponse.json({ error: "no param" }, { status: 400 })
  }

  const canPerform = await hasBalance(session.user.id, from, amount)
  const estimate = await getEstimate(from, to, amount)

  return NextResponse.json({ amount: estimate, hasBalance: canPerform })

  // const res = await fetch(
  //   `https://interface.gateway.uniswap.org/v2/quickroute?tokenInChainId=1&tokenInAddress=${from}&tokenOutChainId=1&tokenOutAddress=${to}&amount=${

  //   }&tradeType=EXACT_IN`,
  //   {
  //     headers: {
  //       origin: "https://app.uniswap.org",
  //     },
  //   }
  // ).then((res) => res.json())
  // console.log(res)

  // const outTokenMeta = await getTokenMetadata(to)
  // const inToken = new Token(
  //   1,
  //   from,
  //   inTokenMeta.decimals,
  //   inTokenMeta.symbol,
  //   inTokenMeta.name
  // )
  // const outToken = new Token(
  //   1,
  //   to,
  //   outTokenMeta.decimals,
  //   outTokenMeta.symbol,
  //   outTokenMeta.name
  // )
  // console.log(inToken, outToken)

  // console.log(`calculating path ${from} -> ${to} for ${amount}`)

  // const path = await router.route(
  //   CurrencyAmount.fromRawAmount(
  //     inToken,
  //     (Number(amount) * Math.pow(10, inToken.decimals)).toString()
  //   ),
  //   outToken,
  //   TradeType.EXACT_INPUT,
  //   {
  //     type: SwapType.UNIVERSAL_ROUTER,
  //     simulate: {
  //       fromAddress: "0xf80fe97797b24956d26d09a51f366229022da597",
  //     },
  //     slippageTolerance: new Percent(5, 100),
  //     deadlineOrPreviousBlockhash: Math.floor(Date.now() / 1000) + 360,
  //   },
  //   {
  //     protocols: [Protocol.V3, Protocol.V2],
  //     enableFeeOnTransferFeeFetching: true,

  //     v2PoolSelection: {
  //       topN: 3,
  //       topNDirectSwaps: 1,
  //       topNTokenInOut: 5,
  //       topNSecondHop: 2,
  //       topNWithEachBaseToken: 2,
  //       topNWithBaseToken: 6,
  //     },
  //     v3PoolSelection: {
  //       topN: 2,
  //       topNDirectSwaps: 2,
  //       topNTokenInOut: 2,
  //       topNSecondHop: 1,
  //       topNWithEachBaseToken: 3,
  //       topNWithBaseToken: 2,
  //     },
  //     maxSwapsPerPath: 2,
  //     maxSplits: 1,
  //     forceCrossProtocol: false,
  //   }
  // )
  // console.log("done")

  // if (!path) {
  //   throw new Error("Cannot get path")
  // }

  // return NextResponse.json({ amount: path.quote.toFixed(2) })
  // return NextResponse.json({ amount: await provider.getBlockNumber() })
}
