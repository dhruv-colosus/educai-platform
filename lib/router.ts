import { WETH_ADDR } from "@/types"
import {
  ChainId,
  CurrencyAmount,
  Token,
  TradeType,
  WETH9,
} from "@uniswap/sdk-core"
import { cacheFunction, getTokenMetadata } from "./api"
import { Pair, Route, Trade } from "@uniswap/v2-sdk"
import IUniswapV2Pair from "@uniswap/v2-core/build/IUniswapV2Pair.json"
import Web3 from "web3"
import { getEthPrice } from "./serv-utils"
import { router } from "./eth"
import { Decimal } from "@prisma/client/runtime/library"

const chainId = ChainId.MAINNET

const WETH = WETH9[chainId]

const web3 = new Web3(process.env.JSON_RPC_PROVIDER)

const getPair = cacheFunction(
  async function _getPair(tokenAddress: string) {
    const otherMeta = await getTokenMetadata(tokenAddress)
    const token = new Token(chainId, tokenAddress, otherMeta.decimals)

    const pairAddress = Pair.getAddress(token, WETH)

    const pairContract = new web3.eth.Contract(IUniswapV2Pair.abi, pairAddress)
    const reserves = await pairContract.methods.getReserves().call()

    const { reserve0, reserve1 }: { reserve0: bigint; reserve1: bigint } =
      reserves as any

    const tokens = [token, WETH]
    const [token0, token1] = tokens[0].sortsBefore(tokens[1])
      ? tokens
      : [tokens[1], tokens[0]]

    console.log(reserve0, reserve1)
    console.log(token0.address, token1.address)

    const pair = new Pair(
      CurrencyAmount.fromRawAmount(token0, reserve0.toString()),
      CurrencyAmount.fromRawAmount(token1, reserve1.toString())
    )

    return { token, pair }
  },
  (tokenAddress) => tokenAddress,
  1000 * 60
)

export const getMidPrice = async (tokenAddress: string) => {
  const { token, pair } = await getPair(tokenAddress)
  const route = new Route([pair], token, WETH)
  const usd = await getEthPrice({})
  const eth = Number(route.midPrice.toSignificant(6))
  return { eth, usd: eth * usd }
}
