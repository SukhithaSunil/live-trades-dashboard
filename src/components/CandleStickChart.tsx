import React, { useEffect, useRef, useState } from "react"
import { Paper, Typography } from "@mui/material"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js"
import { Chart } from "react-chartjs-2"
import "chartjs-adapter-date-fns"
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial"
import ToggleIntervals from "./ToggleIntervals"
import type { Interval } from "../constants"
import { Colors } from "chart.js"

// -----------------------------
// Register Chart.js controllers
// -----------------------------
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  CandlestickController,
  CandlestickElement,
  Title,
  Tooltip,
  Legend,
  Colors
)

// -----------------------------
// Types
// -----------------------------
export type BinanceKline = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string
]

interface Candle {
  x: number // timestamp
  o: number
  h: number
  l: number
  c: number
}

interface CandleStickChartProps {
  symbol: string
}

// -----------------------------
// Component
// -----------------------------
const CandlestickChart: React.FC<CandleStickChartProps> = ({ symbol }) => {
  const [data, setData] = useState<Candle[]>([])
  const [selectedInterval, setInterval] = useState<Interval>("1m")

  const formatCandle = (c: BinanceKline): Candle => ({
    x: c[0],
    o: parseFloat(c[1]),
    h: parseFloat(c[2]),
    l: parseFloat(c[3]),
    c: parseFloat(c[4]),
  })

  const loadHistorical = async () => {
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${selectedInterval}&limit=200`
    const res = await fetch(url)
    if (!res.ok)
      return console.error("Failed to load historical:", res.statusText)
    const klines: BinanceKline[] = await res.json()
    setData(klines.map(formatCandle))
  }

  const openWebSocket = () => {
    const streamName = `${symbol.toLowerCase()}@kline_${selectedInterval}`
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamName}`)

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      const k = msg.k
      const candle: Candle = {
        x: k.t,
        o: parseFloat(k.o),
        h: parseFloat(k.h),
        l: parseFloat(k.l),
        c: parseFloat(k.c),
      }

      setData((prev) => {
        const newData = [...prev]
        const last = newData[newData.length - 1]
        if (last && last.x === candle.x) {
          newData[newData.length - 1] = candle
        } else {
          newData.push(candle)
        }
        return newData
      })
    }

    ws.onerror = (e) => console.error("WebSocket error:", e)
    return ws
  }

  useEffect(() => {
    loadHistorical()
    const ws = openWebSocket()
    return () => ws.close()
  }, [symbol, selectedInterval])

  // -----------------------------
  // Chart.js data & options
  // -----------------------------

  const chartData = {
    datasets: [
      {
        label: symbol,
        data,
        type: "candlestick" as const,
        // borderColor: "black", // outline for all candles
        color: { up: "#00b894", down: "#d63031" },
        borderWidth: 1,
        backgroundColors: {
          up: "rgba(0,184,148,0.3)",
          down: "rgba(214,48,49,0.3)",
          unchanged: "rgba(201, 203, 207, 0.5)",
        },
        // risingBorderColor: "#edf0efff", // green outline for bullish
        // risingBackgroundColor: "rgba(0,184,148,0.3)", // green fill
        // fallingBorderColor: "#d63031", // red outline for bearish
        // fallingBackgroundColor: "rgba(214,48,49,0.3)", // red fill,
      },
    ],
  }

  const getTimeUnit = (interval: string) => {
    if (interval.endsWith("m")) return "minute"
    if (interval.endsWith("h") && parseInt(interval) < 12) return "hour"
    if (interval.endsWith("h") && parseInt(interval) >= 12) return "day"
    if (interval.endsWith("d")) return "day"
    if (interval === "1w") return "week"
    return "day"
  }
  const options: ChartOptions<"candlestick"> = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: getTimeUnit(selectedInterval),
        },
        ticks: {
          color: "#EAECEF",
        },
        grid: {
          color: "#2e2e2eff",
        },
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: "#EAECEF",
          callback: (value) => {
            if (typeof value !== "number") return value
            // Format large numbers
            if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M"
            if (value >= 1_000) return (value / 1_000).toFixed(1) + "K"
            return value.toFixed(2)
          },
        },
        grid: {
          color: "#2E2E2E",
        },
      },
    },
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {symbol} — {selectedInterval} — Candlestick Chart
      </Typography>
      <ToggleIntervals interval={selectedInterval} setInterval={setInterval} />
      <Chart type="candlestick" data={chartData} options={options} />
    </Paper>
  )
}

export default CandlestickChart
