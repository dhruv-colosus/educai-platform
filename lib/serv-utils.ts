import { Decimal } from "@prisma/client/runtime/library"
import { cacheFunction } from "./api"

export const getEthPrice = cacheFunction(
  async function _getEthPrice(): Promise<number> {
    return fetch(
      "https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=ethereum"
    )
      .then((res) => res.json())
      .then((data) => data?.ethereum?.usd || 3300)
  },
  () => "",
  1000 * 60
)

export async function getStartingBalance() {
  return new Decimal(1).mul(new Decimal(10).pow(18))
}
