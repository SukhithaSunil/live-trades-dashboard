import type { availableTickers, INTERVALS } from "./constants"

export interface TickerData {
  symbol: string
  price: number // Last price
  changePct: number
  change: number
  high: number
  low: number
  volume: number
  open: number
}
export type TickerSymbol = (typeof availableTickers)[number]
export type TickerStreamDataMap = Partial<Record<TickerSymbol, TickerData>>
export type Interval = (typeof INTERVALS)[number]
export interface Candle {
  x: number // start time
  o: number
  h: number
  l: number
  c: number
}
export type BinanceCandle = [
  number, // Kline open time
  string, // Open price
  string, // High price
  string, // Low price
  string, // Close price
  string, // Volume
  number, // Kline Close time
  string, // Quote asset volume
  number, // Number of trades
  string, // Taker buy base asset volume
  string, // Taker buy quote asset volume
  string // Unused field, ignore.
]
