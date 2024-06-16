import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function nFormatter(num: number, digits: number = 2) {
  const lookup = [ // TODO format decimals
    { value: 1e-18, symbol: "" },
    { value: 1e-15, symbol: "" },
    { value: 1e-12, symbol: "" },
    { value: 1e-9, symbol: "" },
    { value: 1e-6, symbol: "" },
    { value: 1e-3, symbol: "" },
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "Million" },
    { value: 1e9, symbol: "Billion" },
    { value: 1e12, symbol: "Trillion" },
    { value: 1e15, symbol: "Quadrillion" },
    { value: 1e18, symbol: "Pentillion" },
  ]
  const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/
  const item = lookup.findLast((item) => num >= item.value)
  return item
    ? (num / item.value)
        .toFixed(digits)
        .replace(regexp, "")
        .concat(" " + item.symbol)
    : "0"
}
