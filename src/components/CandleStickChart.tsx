import {
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material"
import type { ApexOptions } from "apexcharts"
import { useEffect, useState } from "react"
import Chart from "react-apexcharts"
import { INTERVALS, type Interval } from "../constants"
import ToggleIntervals from "./ToggleIntervals"

// -----------------------------
// Types
// -----------------------------

export type BinanceKline = [
  number, // open time
  string, // open
  string, // high
  string, // low
  string, // close
  string, // volume
  number, // close time
  string, // quote asset volume
  number, // number of trades
  string, // taker buy base volume
  string, // taker buy quote volume
  string // ignore
]

export interface Candle {
  x: Date
  y: [number, number, number, number]
}

interface KlineMessage {
  k: {
    t: number
    o: string
    h: string
    l: string
    c: string
    v: string
    x: boolean // candle closed?
  }
}

interface CandleStickChartProps {
  symbol: string
}

// -----------------------------
// Component
// -----------------------------
const CandlestickChart: React.FC<CandleStickChartProps> = ({ symbol }) => {
  const [series, setSeries] = useState<{ data: Candle[] }[]>([{ data: [] }])
  const [selectedInterval, setInterval] = useState<Interval>("1m")
  // -----------------------------
  // Format REST kline -> Apex candle
  // -----------------------------
  const formatCandle = (c: BinanceKline): Candle => ({
    x: new Date(c[0]),
    y: [parseFloat(c[1]), parseFloat(c[2]), parseFloat(c[3]), parseFloat(c[4])],
  })

  // -----------------------------
  // Fetch Historical Data
  // -----------------------------
  const loadHistorical = async () => {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${selectedInterval}&limit=200`
    const res = await fetch(url)
    if (!res.ok)
      return console.error("Failed to load historical:", res.statusText)
    const data: BinanceKline[] = await res.json()
    setSeries([{ data: data.map(formatCandle) }])
  }

  // -----------------------------
  // WebSocket Live Updates
  // -----------------------------
  const openWebSocket = () => {
    const streamName = `${symbol.toLowerCase()}@kline_${selectedInterval}`
    const wsUrl = `wss://stream.binance.com:9443/ws/${streamName}`
    const ws = new WebSocket(wsUrl)

    ws.onmessage = (event) => {
      const json: KlineMessage = JSON.parse(event.data)
      const k = json.k
      const live: Candle = {
        x: new Date(k.t),
        y: [parseFloat(k.o), parseFloat(k.h), parseFloat(k.l), parseFloat(k.c)],
      }

      setSeries((prev) => {
        const data = [...prev[0].data]
        const last = data[data.length - 1]
        if (last && last.x.getTime() === live.x.getTime()) {
          data[data.length - 1] = live
        } else {
          data.push(live)
        }
        return [{ data }]
      })
    }

    ws.onerror = (e) => console.error("WebSocket error:", e)
    return ws
  }

  // -----------------------------
  // Effect: fetch data & websocket
  // -----------------------------
  useEffect(() => {
    loadHistorical()
    const ws = openWebSocket()
    return () => ws.close()
  }, [symbol, selectedInterval])

  // -----------------------------
  // Dynamic X-axis formatter
  // -----------------------------
  const getXaxisFormatter = (interval: string) => {
    if (interval.endsWith("m") || interval.endsWith("h")) return "HH:mm"
    if (interval.endsWith("d")) return "dd MMM"
    if (interval === "1w") return "MMM yyyy"
    return "HH:mm"
  }

  // -----------------------------
  // ApexCharts options
  // -----------------------------
  const options: ApexOptions = {
    chart: { type: "candlestick", height: 500, animations: { enabled: false } },
    xaxis: {
      type: "datetime",
      title: { text: "Time", style: { color: "#EAECEF", fontSize: "14px" } },
      labels: {
        rotate: -45,
        style: { fontSize: "12px", colors: "#EAECEF" },
        formatter: (val) => {
          const date = new Date(val)
          const format = getXaxisFormatter(selectedInterval)
          if (format === "HH:mm")
            return `${date.getHours().toString().padStart(2, "0")}:${date
              .getMinutes()
              .toString()
              .padStart(2, "0")}`
          if (format === "dd MMM")
            return `${date.getDate()} ${date.toLocaleString("default", {
              month: "short",
            })}`
          if (format === "MMM yyyy")
            return `${date.toLocaleString("default", {
              month: "short",
            })} ${date.getFullYear()}`
          return date.toLocaleString()
        },
      },
    },
    yaxis: {
      title: {
        text: "Price (USDT)",
        style: { color: "#EAECEF", fontSize: "14px" },
      },
      labels: {
        formatter: (val) => {
          if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + "M"
          if (val >= 1_000) return (val / 1_000).toFixed(1) + "K"
          return val.toFixed(2)
        },
        style: { colors: "#EAECEF", fontSize: "12px" },
      },
    },
    tooltip: {
      enabled: true,
      shared: true,
      y: { formatter: (val) => `$${val.toFixed(2)}` },
    },
  }

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {symbol} — {selectedInterval} — Live Candlestick Chart (TypeScript)
      </Typography>

      <ToggleIntervals interval={selectedInterval} setInterval={setInterval} />
      <Chart
        options={options}
        series={series}
        type="candlestick"
        height={500}
      />
    </Paper>
  )
}

export default CandlestickChart
