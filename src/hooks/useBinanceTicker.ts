// src/hooks/useBinanceTicker.ts
import { enqueueSnackbar } from "notistack"
import { useEffect, useRef, useState } from "react"
import { availableTickers, DEFAULT_THRESHOLDS } from "../constants"
import type { TickerStreamDataMap } from "../types"

export const useBinanceTicker = (): TickerStreamDataMap => {
  const [data, setData] = useState<TickerStreamDataMap>({})
  const dataRef = useRef<TickerStreamDataMap>({})
  const isMounted = useRef(false)

  // Keep ref updated for interval to read latest data
  useEffect(() => {
    dataRef.current = data
  }, [data])

  const checkPriceThreshold = (symbol: string, currentPrice: number) => {
    const threshold = DEFAULT_THRESHOLDS[symbol]
    if (!threshold) return

    if (threshold.above && currentPrice > threshold.above) {
      console.log("ABOVE TRIGGER fired")
      enqueueSnackbar(`${symbol} crossed ABOVE ${threshold.above}`, {
        variant: "success",
      })
    }

    if (threshold.below && currentPrice < threshold.below) {
      console.log("BELOW TRIGGER fired")
      enqueueSnackbar(`${symbol} dropped BELOW ${threshold.below}`, {
        variant: "error",
      })
    }
  }

  // WebSocket connection
  useEffect(() => {
    const streams = availableTickers
      .map((s) => `${s.toLowerCase()}@ticker`)
      .join("/")
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streams}`
    )

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

    return () => ws.close()
  }, [availableTickers])

  const allDataReady = Object.keys(data).length === availableTickers.length

  // Start interval once when all availableTickers have data
  useEffect(() => {
    if (!allDataReady || isMounted.current) return

    isMounted.current = true
    console.log("All availableTickers loaded → running initial threshold check")

    // Run threshold check immediately once
    Object.entries(dataRef.current).forEach(([symbol, ticker]) => {
      checkPriceThreshold(symbol, ticker.price)
    })

    // Then start interval for periodic checks
    const interval = setInterval(() => {
      Object.entries(dataRef.current).forEach(([symbol, ticker]) => {
        checkPriceThreshold(symbol, ticker.price)
      })
    }, 60_000) // every 1 min

    return () => clearInterval(interval)
  }, [allDataReady])

  return data
}
