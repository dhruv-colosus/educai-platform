import { revalidateTag } from "next/cache"
import { Sema, RateLimit } from "async-sema"
import {
  BasicTokenInfo,
  HoneypotData,
  TokenPrice,
  TopHolder,
  WETH_ADDR,
} from "@/types"
import { Decimal } from "@prisma/client/runtime/library"
import prisma from "@/prisma/db"
import cache from "./cache"

export function cacheFunction<T, V>(
  fn: (props: T) => V,
  keyGetter: (props: T) => string,
  ttl: number
) {
  return (props: T) => {
    const key = keyGetter(props)
    const tag = fn.name + "-" + key
    const cachedVal = cache.get(tag)

    if (cachedVal !== undefined) {
      return cachedVal as V
    }

    return Promise.resolve(fn(props)).then((newVal) => {
      cache.set(tag, newVal, { ttl })
      return newVal
    })
  }
}

const chainbaseRateLim = RateLimit(1)
const chainbaseConcurrentLim = new Sema(1)
const getChainbaseData = cacheFunction(
  async function _getChainbaseData({
    path,
    params,
  }: {
    path: string
    params: URLSearchParams
  }) {
    await chainbaseConcurrentLim.acquire()
    await chainbaseRateLim()

    const data = await fetch(`https://api.chainbase.online/${path}?${params}`, {
      headers: { "x-api-key": process.env.CHAINBASE_API_KEY! },
    })
      .then((res) => res.json())
      .finally(() => {
        chainbaseConcurrentLim.release()
      })

    if (data.code === 429) {
      console.log("Rate limited:", path)
      throw new Error("Rate limit exceeded")
    }

    return data.data
  },
  (props) => props.params.toString(),
  1000 * 60
)

export async function getTopHolders(
  tokenAddress: string
): Promise<TopHolder[]> {
  const data = await getChainbaseData({
    path: "v1/token/top-holders",
    params: new URLSearchParams({
      chain_id: "1",
      contract_address: tokenAddress,
      limit: "5",
    }),
  })

  return data
}

export interface TokenMetadata {
  name: string
  decimals: number
  symbol: string
  total_supply: number
  current_usd_price: number
  logos: [url: string]
}

export async function getTokenMetadata(
  tokenAddress: string
): Promise<TokenMetadata> {
  const data = await getChainbaseData({
    path: "v1/token/metadata",
    params: new URLSearchParams({
      chain_id: "1",
      contract_address: tokenAddress,
    }),
  })

  return data
}

interface HistoricPrice {
  price: number
  updated_at: number
}

export async function getHistoricPrice(
  tokenAddress: string
): Promise<HistoricPrice[]> {
  const MS_BACK = 1000 * 60 * 60 * 24 * 30 // 30 days

  const data = await getChainbaseData({
    path: "v1/token/price/history",
    params: new URLSearchParams({
      chain_id: "1",
      contract_address: tokenAddress,
      start_timestamp: Math.floor((Date.now() - MS_BACK) / 1000).toString(),
      end_timestamp: Math.floor(Date.now() / 1000).toString(),
    }),
  })

  return data || []
}


interface TrendingToken {
  token_name: string
  token_symbol: string
  contract_address: string
  price_usd: string
  price_24h_percent_change: string
}

export const getTrendingTokens = cacheFunction(
  async function _getTrendingTokens(): Promise<TrendingToken[]> {
    const data = await fetch(
      `https://deep-index.moralis.io/api/v2.2/market-data/erc20s/top-tokens`,
      {
        headers: {
          "X-API-Key": process.env.MORALIS_API_KEY!,
        },
        next: { revalidate: 60 * 10 },
      }
    ).then((data) => data.json())
    if (!data || !data.map) {
      return []
    }

    return data
  },
  () => "",
  1000 * 60 * 5
)

export async function getEstimate(
  from: string,
  to: string,
  amount: string
): Promise<string> {
  const inTokenBasic = await getTokenInfoBasic(from)

  const res = await fetch("https://interface.gateway.uniswap.org/v2/quote", {
    headers: {
      origin: "https://app.uniswap.org",
      "x-request-source": "uniswap-web",
    },
    body: JSON.stringify({
      tokenInChainId: 1,
      tokenIn: from,
      tokenOutChainId: 1,
      tokenOut: to,
      amount: new Decimal(amount)
        .mul(new Decimal(10).pow(inTokenBasic!.decimals))
        .toFixed(0),
      sendPortionEnabled: true,
      type: "EXACT_INPUT",
      intent: "quote",
      configs: [
        { useSyntheticQuotes: false, routingType: "DUTCH_LIMIT" },
        {
          protocols: ["V2", "V3", "MIXED"],
          enableUniversalRouter: true,
          routingType: "CLASSIC",
          enableFeeOnTransferFeeFetching: true,
        },
      ],
    }),
    method: "POST",
    mode: "cors",
    credentials: "omit",
  }).then((res) => res.json())

  console.log(res)

  return res?.quote?.quoteDecimals || "0"
}

export const getTokens = cacheFunction(
  async function _getTokens(): Promise<BasicTokenInfo[]> {
    return await fetch("https://tokens.coingecko.com/uniswap/all.json", {
      next: { revalidate: 60 * 30 },
    })
      .then((res) => res.json())
      .then((data) => data.tokens)
  },
  () => "",
  1000 * 60 * 10
)

export const getTokenInfoBasic = cacheFunction(
  async function _getTokenInfoBasic(
    tokenAddress: string
  ): Promise<BasicTokenInfo | undefined> {
    const allTokens: BasicTokenInfo[] = await getTokens({})
    return allTokens.find(
      (tok: BasicTokenInfo) =>
        tok.address.toLowerCase() === tokenAddress.toLowerCase()
    )
  },
  (tokenAddress) => tokenAddress,
  1000 * 60 * 60
)

export async function hasBalance(
  userId: string,
  tokenAddress: string,
  amt: string
) {
  if (tokenAddress === WETH_ADDR) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return false
    return user.balance.greaterThanOrEqualTo(
      new Decimal(amt).mul(new Decimal(10).pow(18))
    )
  } else {
    const tok = await prisma.tokenBalance.findUnique({
      where: { userId_tokenAddress: { userId, tokenAddress } },
      include: { token: true },
    })

    if (!tok) return false

    return tok.balance.greaterThanOrEqualTo(
      new Decimal(amt).mul(new Decimal(10).pow(tok.token.decimals))
    )
  }
}

export const getHoneypotData = cacheFunction(
  async function _getHoneypotData(tokenAddress: string): Promise<HoneypotData> {
    console.log("refetching honeypot for", tokenAddress)
    return await fetch(
      "https://api.honeypot.is/v2/IsHoneypot?" +
        new URLSearchParams({ address: tokenAddress }).toString(),
      { next: { revalidate: 60 * 10 } }
    ).then((data) => data.json())
  },
  (tokenAddress) => tokenAddress,
  1000 * 60 * 10
)
