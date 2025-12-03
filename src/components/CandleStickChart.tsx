import React, { useEffect, useState } from "react"
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
  Colors,
} from "chart.js"
import { Chart } from "react-chartjs-2"
import "chartjs-adapter-date-fns"
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial"
import ToggleIntervals from "./ToggleIntervals"
import type { BinanceCandle, Candle, Interval, TickerSymbol } from "../types"
import { INTERVALS, TickerNames, TickerPairs } from "../constants"

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
interface CandleStickChartProps {
  selectedTicker: TickerSymbol
}

const CandlestickChart: React.FC<CandleStickChartProps> = ({
  selectedTicker,
}) => {
  const [data, setData] = useState<Candle[]>([])
  const [selectedInterval, setInterval] = useState<Interval>(INTERVALS[0])

  const formatCandle = (c: BinanceCandle): Candle => ({
    x: c[0],
    o: parseFloat(c[1]),
    h: parseFloat(c[2]),
    l: parseFloat(c[3]),
    c: parseFloat(c[4]),
  })

  const getStartTime = (interval: Interval) => {
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

  const loadHistorical = async () => {
    // Compute dynamic startTime based on interval
    const startTime = getStartTime(selectedInterval)
    const url = `https://api.binance.com/api/v3/klines?symbol=${selectedTicker}&interval=${selectedInterval}&startTime=${startTime}&limit=1000`
    //candlestick bars for a symbol. candlestick are uniquely identified by their open time.
    const res = await fetch(url)
    if (!res.ok)
      return console.error("Failed to load historical:", res.statusText)
    //todo error alert
    const klines: BinanceCandle[] = await res.json()
    setData(klines.map(formatCandle))
  }
  const openWebSocket = () => {
    const streamName = `${selectedTicker.toLowerCase()}@kline_${selectedInterval}`
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${streamName}`)
    //The Candlestick Stream push updates to the current klines/candlestick every 250 milliseconds.
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      const k = msg.k
      const candle: Candle = {
        x: k.t, // Candlestick start time
        o: parseFloat(k.o), // Open price
        h: parseFloat(k.h), // High price
        l: parseFloat(k.l), // Low price
        c: parseFloat(k.c), // Close price
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
    // todo error handling
    ws.onerror = (e) => console.error("WebSocket error:", e)
    return ws
  }

  useEffect(() => {
    loadHistorical()
    // Open WebSocket for live updates
    const ws = openWebSocket()
    return () => ws.close()
  }, [selectedTicker, selectedInterval])

  const getTimeUnit = (
    displayData: Candle[]
  ): "minute" | "hour" | "day" | "month" => {
    if (!displayData || displayData.length < 2) return "day"
    const first = displayData[0].x
    const last = displayData[displayData.length - 1].x
    const rangeMs = last - first

    if (rangeMs <= 1000 * 60 * 60) return "minute"
    if (rangeMs <= 1000 * 60 * 60 * 24) return "hour"
    if (rangeMs <= 1000 * 60 * 60 * 24 * 31) return "day" //
    return "month"
  }

  const chartData = {
    datasets: [
      {
        label: selectedTicker,
        data,
        type: "candlestick" as const,
        color: { up: "#00b894", down: "#d63031" },
        borderWidth: 1,
        backgroundColors: {
          up: "rgba(0,184,148,0.3)",
          down: "rgba(214,48,49,0.3)",
          unchanged: "rgba(201, 203, 207, 0.5)",
        },
      },
    ],
  }

  const options: ChartOptions<"candlestick"> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        type: "time",
        time: { unit: getTimeUnit(data) }, //time unit based on data range
        min: data[0]?.x,
        max: data[data.length - 1]?.x,
        ticks: { color: "#EAECEF" },
        grid: { color: "#2e2e2eff" },
      },
      y: {
        beginAtZero: false,
        ticks: {
          color: "#EAECEF",
          callback: (value) => {
            if (typeof value !== "number") return value
            if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M"
            if (value >= 1_000) return (value / 1_000).toFixed(1) + "K"
            return value.toFixed(2)
          },
        },
        grid: { color: "#2E2E2E" },
      },
    },
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {TickerNames[selectedTicker]}
      </Typography>
      <ToggleIntervals interval={selectedInterval} setInterval={setInterval} />
      <Chart type="candlestick" data={chartData} options={options} />
    </Paper>
  )
}

export default CandlestickChart
