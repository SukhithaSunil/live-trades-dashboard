// src/components/RealTimeChart.tsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { TickerPrice } from "../hooks/useBinancePrices";

interface Props {
  price: TickerPrice | undefined;
}

interface ChartPoint {
  time: string;
  price: number;
}

const RealTimeChart: React.FC<Props> = ({ price }) => {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    if (!price) return;

    const now = new Date().toLocaleTimeString();

    setData((prev) => [
      ...prev.slice(-30), // keep last 30 points
      { time: now, price: price.price },
    ]);
  }, [price]);

  if (!price) return <div>Select a ticker</div>;

  return (
    <div style={{ width: "100%", height: 300 }}>
      <h2>{price.symbol} Live Chart</h2>

      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="time" hide />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RealTimeChart;
