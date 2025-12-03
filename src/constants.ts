import type { TickerSymbol } from "./types"

export const options = ["1m", "5m", "1h", "1d"]
export const availableTickers = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "SOLUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
  "DOTUSDT",
  "LTCUSDT",
  "TRXUSDT",
  "LINKUSDT",
  "ATOMUSDT",
  "ETCUSDT",
] as const

export const TickerPairs: Record<TickerSymbol, string> = {
  BTCUSDT: "BTC / USDT",
  ETHUSDT: "ETH / USDT",
  BNBUSDT: "BNB / USDT",
  XRPUSDT: "XRP / USDT",
  ADAUSDT: "ADA / USDT",
  SOLUSDT: "SOL / USDT",
  DOGEUSDT: "DOGE / USDT",
  AVAXUSDT: "AVAX / USDT",
  DOTUSDT: "DOT / USDT",
  LTCUSDT: "LTC / USDT",
  TRXUSDT: "TRX / USDT",
  LINKUSDT: "LINK / USDT",
  ATOMUSDT: "ATOM / USDT",
  ETCUSDT: "ETC / USDT",
}
export const popularTickers: TickerSymbol[] = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "XRPUSDT",
] as const
export const watchlist: TickerSymbol[] = [
  "ADAUSDT",
  "SOLUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
  "DOTUSDT",
  "LTCUSDT",
  "TRXUSDT",
  "LINKUSDT",
  "ATOMUSDT",
  "ETCUSDT",
] as const

export const PopularPairs = {
  BTCUSDT: "BTC / USDT",
  ETHUSDT: "ETH / USDT",
  BNBUSDT: "BNB / USDT",
  XRPUSDT: "XRP / USDT",
} as const

export type PopularPairKeys = keyof typeof PopularPairs
export const WatchSymbolsPairs = {
  ADAUSDT: "ADA / USDT",
  SOLUSDT: "SOL / USDT",
  DOGEUSDT: "DOGE / USDT",
  AVAXUSDT: "AVAX / USDT",
  DOTUSDT: "DOT / USDT",
  LTCUSDT: "LTC / USDT",
  TRXUSDT: "TRX / USDT",
  ETCUSDT: "ETC / USDT",
} as const
export type WatchPairKeys = keyof typeof WatchSymbolsPairs
export const watchSymbols: WatchPairKeys[] = [
  "ADAUSDT",
  "SOLUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
  "DOTUSDT",
  "LTCUSDT",
  "TRXUSDT",
  "ETCUSDT",
]
export const TickerNames: Record<TickerSymbol, string> = {
  BTCUSDT: "Bitcoin",
  ETHUSDT: "Ethereum",
  BNBUSDT: "BNB",
  XRPUSDT: "XRP",
  ADAUSDT: "Cardano",
  SOLUSDT: "Solana",
  DOGEUSDT: "Dogecoin",
  AVAXUSDT: "Avalanche",
  DOTUSDT: "Polkadot",
  LTCUSDT: "Litecoin",
  TRXUSDT: "TRON",
  LINKUSDT: "Chainlink",
  ATOMUSDT: "Cosmos",
  ETCUSDT: "Ethereum Classic",
}

export const INTERVALS = [
  "5m",
  "30m",
  "1h",
  "4h",
  "6h",
  "12h",
  "1d",
  "1w",
] as const
export interface PriceThreshold {
  [symbol: string]: {
    above?: number
    below?: number
  }
}
export const DEFAULT_THRESHOLDS: PriceThreshold = {
  BTCUSDT: { above: 86200, below: 86600 },
  ETHUSDT: { above: 2500 },
}
