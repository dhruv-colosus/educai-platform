import { TokenPrice } from "@/types"
import { useQuery } from "@tanstack/react-query"

export const useUsdPrice = (tokenAddress: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["usd-price", tokenAddress],
    queryFn: (): Promise<number> =>
      fetch("/api/token/usd?address=" + tokenAddress)
        .then((res) => res.json())
        .then((data) => data.info.usd),
  })

  return { usdPrice: data, isLoading, isError }
}
