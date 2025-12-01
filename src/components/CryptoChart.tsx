// src/components/CryptoChart.tsx
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Paper, Typography } from "@mui/material";

interface Props {
  selected: string;
  price: number | undefined;
}

export default function CryptoChart({ selected, price }: Props) {
  const [history, setHistory] = useState<{ time: string; price: number }[]>([]);

  useEffect(() => {
    if (!price) return;

    setHistory((prev) => [
      ...prev.slice(-60), // limit data
      { time: new Date().toLocaleTimeString(), price },
    ]);
  }, [price]);

  return (
    <Paper sx={{ height: 350 }}>
      <Typography variant="h6" mb={2}>
        {selected} Live Chart
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={history}>
          <XAxis dataKey="time" hide />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#1976d2" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}
