// src/hooks/useBinanceTicker.ts
import { useEffect, useRef, useState } from "react"
import { THRESHOLDS } from "../constants"
import { enqueueSnackbar } from "notistack"

export interface TickerData {
  symbol: string
  price: number
  changePct: number
  change: number
  high: number
  low: number
  volume: number
  open: number
  bid: number
  ask: number
  trades: number
}

export const useBinanceTicker = (symbols: string[]) => {
  const [data, setData] = useState<Record<string, TickerData>>({})
  const dataRef = useRef<Record<string, TickerData>>({})
  const isMounted = useRef(false)

  // Keep ref updated for interval to read latest data
  useEffect(() => {
    dataRef.current = data
  }, [data])

  const checkPriceThreshold = (symbol: string, currentPrice: number) => {
    const threshold = THRESHOLDS[symbol]
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
    if (symbols.length === 0) return

    const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join("/")
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streams}`
    )

    ws.onmessage = (msg) => {
      const parsed = JSON.parse(msg.data)
      if (!parsed.data) return

      const payload = parsed.data
      const symbol = payload.s
      const price = parseFloat(payload.c)

      setData((prev) => ({
        ...prev,
        [symbol]: {
          symbol,
          price,
          change: parseFloat(payload.p),
          changePct: parseFloat(payload.P),
          high: parseFloat(payload.h),
          low: parseFloat(payload.l),
          volume: parseFloat(payload.v),
          open: parseFloat(payload.o),
          bid: parseFloat(payload.b),
          ask: parseFloat(payload.a),
          trades: payload.n,
        },
      }))
    }

    return () => ws.close()
  }, [symbols])

  const allDataReady = Object.keys(data).length === symbols.length

  // Start interval once when all symbols have data
  useEffect(() => {
    if (!allDataReady || isMounted.current) return

    isMounted.current = true
    console.log("All symbols loaded → running initial threshold check")

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

  return { data }
}
