import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Paper,
  Grid,
} from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface KlineData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}
interface Props {
  selectedTicker: string;
}
const Dashboard: React.FC<Props> = ({ selectedTicker }: Props) => {
  const [klineData, setKlineData] = useState<KlineData[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Close old websocket if switching symbol
    if (wsRef.current) wsRef.current.close();

    // Binance WebSocket for 1-minute kline/candlestick
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${selectedTicker.toLowerCase()}@kline_1m`
    );
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const k = message.k; // kline object
      const newPoint: KlineData = {
        time: new Date(k.t).toLocaleTimeString(),
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
        volume: parseFloat(k.v),
      };
      setKlineData((prev) => [...prev.slice(-19), newPoint]); // Keep last 20
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [selectedTicker]);

  const chartData = {
    labels: klineData.map((dp) => dp.time),
    datasets: [
      {
        label: `${selectedTicker.toUpperCase()} Close Price`,
        data: klineData.map((dp) => dp.close),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.2,
      },
      {
        label: "High",
        data: klineData.map((dp) => dp.high),
        borderColor: "rgba(255,99,132,0.6)",
        fill: false,
        tension: 0.2,
      },
      {
        label: "Low",
        data: klineData.map((dp) => dp.low),
        borderColor: "rgba(54,162,235,0.6)",
        fill: false,
        tension: 0.2,
      },
    ],
  };

  const volumeData = {
    labels: klineData.map((dp) => dp.time),
    datasets: [
      {
        label: "Volume",
        data: klineData.map((dp) => dp.volume),
        backgroundColor: "rgba(153,102,255,0.6)",
      },
    ],
  };

  return (
    <Container>
      <Box>
        {/* <FormControl sx={{ minWidth: 120, mb: 3 }}>
          <InputLabel>Symbol</InputLabel>
          <Select
            value={symbol}
            label="Symbol"
            onChange={(e) => setSymbol(e.target.value)}
          >
            <MenuItem value="btcusdt">BTC/USDT</MenuItem>
            <MenuItem value="ethusdt">ETH/USDT</MenuItem>
            <MenuItem value="bnbusdt">BNB/USDT</MenuItem>
          </Select>
        </FormControl> */}

        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 8 }}>
            <Paper>
              <Line data={chartData} />
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper sx={{ p: 2, mb: 3 }}>
              {/* <Typography variant="h6">Latest Metrics</Typography> */}
              {klineData.length > 0 && (
                <>
                  <Typography>
                    Close: {klineData[klineData.length - 1].close}
                  </Typography>
                  <Typography>
                    High: {klineData[klineData.length - 1].high}
                  </Typography>
                  <Typography>
                    Low: {klineData[klineData.length - 1].low}
                  </Typography>
                  <Typography>
                    Volume: {klineData[klineData.length - 1].volume}
                  </Typography>
                </>
              )}
            </Paper>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">Volume Chart</Typography>
              <Line data={volumeData} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
