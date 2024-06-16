export enum OrderbookOption {
  All = "all",
  Personal = "personal",
}

export interface BasicTokenInfo {
  name: string
  address: string
  symbol: string
  decimals: number
  logoURI: string
}

export const WETH_ADDR = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"

export interface HoneypotData {
  summary: {
    riskLevel: number
  }
  honeypotResult: {
    isHoneypot: boolean
  }
  simulationResult: {
    buyTax: number
    sellTax: number
    transferTax: number
  }
  contractCode: {
    openSource: boolean
  }
}

export interface TokenPrice {
  usdPrice: number
  "24hrPercentChange": string
}

export interface TopHolder {
  wallet_address: string
  original_amount: string
  amount: string
  usd_value: string
}
