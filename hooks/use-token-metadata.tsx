import { TokenMetadata, getTokenMetadata } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export const useTokenMetadata = (tokenAddress: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["token-meta", tokenAddress],
    queryFn: (): Promise<TokenMetadata> =>
      fetch("/api/token/meta?address=" + tokenAddress)
        .then((res) => res.json())
        .then((data) => data.info),
  })

  return { tokenMetadata: data, isLoading, isError }
}
