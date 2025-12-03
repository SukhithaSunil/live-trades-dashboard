import { Paper, Typography } from "@mui/material"
import {
  CategoryScale,
  Chart as ChartJS,
  Colors,
  Legend,
  LinearScale,
  TimeScale,
  Title,
  Tooltip,
  type ChartOptions,
} from "chart.js"
import "chartjs-adapter-date-fns"
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial"
import React, { useState } from "react"
import { Chart } from "react-chartjs-2"
import { INTERVALS, TickerNames } from "../constants"
import { useCandleStickStream } from "../hooks/useCandleStickStream"
import type { Interval, TickerSymbol } from "../types"
import { formatPriceforChart, getTimeUnit } from "../utill"
import ToggleIntervals from "./ToggleIntervals"

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
  const [selectedInterval, setInterval] = useState<Interval>(INTERVALS[0])
  const data = useCandleStickStream({
    selectedTicker,
    selectedInterval,
  })
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
          callback: formatPriceforChart,
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
