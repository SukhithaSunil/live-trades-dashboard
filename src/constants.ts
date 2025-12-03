export const options = ["1m", "5m", "1h", "1d"]
export const key = "d4klf41r01qvpdokvsogd4klf41r01qvpdokvsp0"
export const PopularPairs = {
  BTCUSDT: "BTC / USDT",
  ETHUSDT: "ETH / USDT",
  BNBUSDT: "BNB / USDT",
  XRPUSDT: "XRP / USDT",
} as const
export type PopularPairKeys = keyof typeof PopularPairs
export const popularTickers: PopularPairKeys[] = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "XRPUSDT",
]
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
export type Interval = (typeof INTERVALS)[number]
export interface PriceThreshold {
  [symbol: string]: {
    above?: number
    below?: number
  }
}
export const THRESHOLDS: PriceThreshold = {
  BTCUSDT: { above: 86200, below: 86600 },
  ETHUSDT: { above: 2500 },
}
export interface PriceAlert {
  status: "success" | "info" | "warning" | "error"
  ticker: string
}
export interface PriceAlertData extends PriceAlert {
  open?: boolean
}
