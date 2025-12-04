import { enqueueSnackbar } from "notistack"
import { useEffect, useRef, useState } from "react"
import { availableTickers, DEFAULT_THRESHOLDS, TickerNames } from "../constants"
import type { TickerStreamDataMap, TickerSymbol } from "../types"
import { Binance_WS } from "../network"

export const useTicketLiveStream = (): {
  tickersLiveStream: TickerStreamDataMap
} => {
  const [data, setData] = useState<TickerStreamDataMap>({})
  const dataRef = useRef<TickerStreamDataMap>({})
  const isMounted = useRef(false)

  // Keep ref updated for interval to read latest data
  useEffect(() => {
    dataRef.current = data
  }, [data])

  const checkPriceThreshold = (symbol: TickerSymbol, currentPrice: number) => {
    const threshold = DEFAULT_THRESHOLDS[symbol]
    if (!threshold) return
    if (threshold.above && currentPrice > threshold.above) {
      enqueueSnackbar(
        `The last price of ${TickerNames[symbol]} is above ${threshold.above}`,
        {
          variant: "success",
        }
      )
    }

    if (threshold.below && currentPrice < threshold.below) {
      enqueueSnackbar(
        `The last price of ${TickerNames[symbol]} is below  ${threshold.below}`,
        {
          variant: "warning",
        }
      )
    }
  }

  // WebSocket connection
  useEffect(() => {
    const streams = availableTickers
      .map((s) => `${s.toLowerCase()}@ticker`)
      .join("/")
    const ws = new WebSocket(`${Binance_WS}stream?streams=${streams}`)

    ws.onmessage = (msg) => {
      const parsed = JSON.parse(msg.data)
      const payload = parsed.data
      const symbol = payload.s
      const price = parseFloat(payload.c)
      setData((prev) => ({
        ...prev,
        [symbol]: {
          symbol,
          price, // Last price
          change: parseFloat(payload.p), // Price change
          changePct: parseFloat(payload.P), // Price change percent
          high: parseFloat(payload.h), //high price
          low: parseFloat(payload.l), //low price
          volume: parseFloat(payload.v), // Total traded base asset volume
          open: parseFloat(payload.o), // Statistics open time
        },
      }))
    }
    ws.onerror = () => {
      enqueueSnackbar("Network issue detected — attempting to recover…", {
        variant: "info",
      })
    }

    ws.onclose = () => {
      enqueueSnackbar(" Connection lost…", {
        variant: "info",
      })
    }
    return () => ws.close()
  }, [])

  const allDataReady = Object.keys(data).length === availableTickers.length

  // Start interval once when all availableTickers have data
  useEffect(() => {
    if (!allDataReady || isMounted.current) return

    isMounted.current = true

    // Run threshold check immediately once
    Object.entries(dataRef.current).forEach(([symbol, ticker]) => {
      checkPriceThreshold(symbol as TickerSymbol, ticker.price)
    })

    // Then start interval for periodic checks
    const interval = setInterval(() => {
      Object.entries(dataRef.current).forEach(([symbol, ticker]) => {
        checkPriceThreshold(symbol as TickerSymbol, ticker.price)
      })
    }, 60_000) // every 1 min

    return () => clearInterval(interval)
  }, [allDataReady])

  return { tickersLiveStream: data }
}
