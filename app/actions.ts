"use server"

import { SwapOptionsSwapRouter02, SwapType } from "@uniswap/smart-order-router"
import { CurrencyAmount, Percent, Token, TradeType } from "@uniswap/sdk-core"
import { router } from "@/lib/eth"
import { cacheFunction, getTokenMetadata } from "@/lib/api"
import { Protocol } from "@uniswap/router-sdk"
import { HoneypotData } from "@/types"

const options: SwapOptionsSwapRouter02 = {
  recipient: "0xf80fe97797b24956d26d09a51f366229022da597",
  slippageTolerance: new Percent(50, 10_000),
  deadline: Math.floor(Date.now() / 1000 + 1800),
  type: SwapType.SWAP_ROUTER_02,
}

export async function getEstimate(
  inTokenAddr: string,
  outTokenAddr: string,
  amount: number
) {
  const inTokenMeta = await getTokenMetadata(inTokenAddr)
  const outTokenMeta = await getTokenMetadata(outTokenAddr)
  const inToken = new Token(
    1,
    inTokenAddr,
    inTokenMeta.decimals,
    inTokenMeta.symbol,
    inTokenMeta.name
  )
  const outToken = new Token(
    1,
    outTokenAddr,
    outTokenMeta.decimals,
    outTokenMeta.symbol,
    outTokenMeta.name
  )

  const path = await router.route(
    CurrencyAmount.fromRawAmount(
      inToken,
      (amount * Math.pow(10, inToken.decimals)).toString()
    ),
    outToken,
    TradeType.EXACT_INPUT,
    {
      type: SwapType.UNIVERSAL_ROUTER,
      slippageTolerance: new Percent(5, 100),
      deadlineOrPreviousBlockhash: Math.floor(Date.now() / 1000) + 360,
    },
    {
      protocols: [Protocol.V3, Protocol.V2],
      enableFeeOnTransferFeeFetching: true,

      v2PoolSelection: {
        topN: 3,
        topNDirectSwaps: 1,
        topNTokenInOut: 5,
        topNSecondHop: 2,
        topNWithEachBaseToken: 2,
        topNWithBaseToken: 6,
      },
      v3PoolSelection: {
        topN: 2,
        topNDirectSwaps: 2,
        topNTokenInOut: 2,
        topNSecondHop: 1,
        topNWithEachBaseToken: 3,
        topNWithBaseToken: 2,
      },
      maxSwapsPerPath: 2,
      minSplits: 1,
      maxSplits: 1,
      forceCrossProtocol: false,
    }
  )
  console.log("done")

  if (!path) {
    throw new Error("Cannot get path")
  }

  return { amount: path.quote.toFixed(2) }
}
