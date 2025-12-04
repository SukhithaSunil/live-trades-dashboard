import type { BinanceCandle, Candle, Interval } from "./types"

export const formatPrice = (price: number, symbol: string) => {
  if (!price) return "-"
  if (symbol.endsWith("USDT")) return `${price.toFixed(2)}`
  if (symbol.startsWith("BTC") || symbol.startsWith("ETH"))
    return price.toFixed(2)
  return price.toFixed(6)
}

export const formatVolume = (volume: number) => {
  if (!volume) return "-"
  if (volume >= 1_000_000_000) return (volume / 1_000_000_000).toFixed(2) + "B"
  if (volume >= 1_000_000) return (volume / 1_000_000).toFixed(2) + "M"
  if (volume >= 1_000) return (volume / 1_000).toFixed(2) + "K"
  return volume.toFixed(2)
}

export const formatPercent = (percent: number) => {
  if (percent === undefined || percent === null) return "-"
  return percent.toFixed(2) + "%"
}

export const formatCandle = (c: BinanceCandle): Candle => ({
  x: c[0],
  o: parseFloat(c[1]),
  h: parseFloat(c[2]),
  l: parseFloat(c[3]),
  c: parseFloat(c[4]),
})

export const getStartTime = (interval: Interval) => {
  const now = new Date()
  let start = new Date()

  switch (interval) {
    case "5m":
      start.setHours(now.getHours() - 8)
      break
    case "30m":
      start.setDate(now.getDate() - 1)
      break
    case "1h":
      start.setDate(now.getDate() - 3)
      break
    case "4h":
    case "6h":
    case "12h":
      start.setDate(now.getDate() - 15)
      break
    case "1d":
      start.setMonth(now.getMonth() - 2)
      break
    case "1w":
      start.setFullYear(now.getFullYear() - 2)
      break
    default:
      start.setFullYear(now.getFullYear() - 1)
  }

  return start.getTime()
}

export const getTimeUnit = (
  displayData: Candle[]
): "minute" | "hour" | "day" | "month" => {
  if (!displayData || displayData.length < 2) return "day"
  const first = displayData[0].x
  const last = displayData[displayData.length - 1].x
  const rangeMs = last - first

  if (rangeMs <= 1000 * 60 * 60) return "minute"
  if (rangeMs <= 1000 * 60 * 60 * 24) return "hour"
  if (rangeMs <= 1000 * 60 * 60 * 24 * 31) return "day"
  return "month"
}

export const formatPriceforChart = (value: number | string) => {
  if (typeof value !== "number") return value
  if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M"
  if (value >= 1_000) return (value / 1_000).toFixed(1) + "K"
  return value.toFixed(2)
}
