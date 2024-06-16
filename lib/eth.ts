import { AlphaRouter } from "@uniswap/smart-order-router"
import { ethers } from "ethers"

export const provider = new ethers.providers.JsonRpcProvider({
  url: process.env.JSON_RPC_PROVIDER!,
  skipFetchSetup: true,
})

export const router = new AlphaRouter({
  chainId: 1,
  provider,
})
