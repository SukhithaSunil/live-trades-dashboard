import { useEffect, useState } from "react"
import { Binance_API, Binance_WS } from "../network"
import type { BinanceCandle, Candle, Interval, TickerSymbol } from "../types"
import { formatCandle, getStartTime } from "../utill"
interface UseCandleStickStreamProps {
  selectedTicker: TickerSymbol
  selectedInterval: Interval
}
export const useCandleStickStream = ({
  selectedTicker,
  selectedInterval,
}: UseCandleStickStreamProps) => {
  const [data, setData] = useState<Candle[]>([])

  const getHistoricalData = async () => {
    // Compute dynamic startTime based on interval
    const startTime = getStartTime(selectedInterval)
    const url = `${Binance_API}klines?symbol=${selectedTicker}&interval=${selectedInterval}&startTime=${startTime}&limit=1000`
    //candlestick bars for a symbol. candlestick are uniquely identified by their open time.
    const res = await fetch(url)
    if (!res.ok)
      return console.error("Failed to load historical:", res.statusText)
    //todo error alert
    const klines: BinanceCandle[] = await res.json()
    setData(klines.map(formatCandle))
  }
  const connectWebSocket = () => {
    const streamName = `stream?streams=${selectedTicker.toLowerCase()}@kline_${selectedInterval}`
    const ws = new WebSocket(`${Binance_WS}${streamName}`)
    //The Candlestick Stream push updates to the current klines/candlestick every 250 milliseconds.
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      const k = msg.data.k
      const candle: Candle = {
        x: k.t, // Candlestick start time
        o: parseFloat(k.o), // Open price
        h: parseFloat(k.h), // High price
        l: parseFloat(k.l), // Low price
        c: parseFloat(k.c), // Close price
      }

      setData((oldCandleStick) => {
        const newData = [...oldCandleStick]
        const last = newData[newData.length - 1]
        if (last && last.x === candle.x) {
          newData[newData.length - 1] = candle
        } else {
          newData.push(candle)
        }
        return newData
      })
    }

    return ws
  }

  useEffect(() => {
    getHistoricalData() // fetch past candles
    const ws = connectWebSocket() // open WS
    ws.close()
  }, [selectedTicker, selectedInterval])

  return data
}
