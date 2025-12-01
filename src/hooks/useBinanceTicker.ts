// src/hooks/useBinanceTicker.ts
import { useEffect, useState } from "react";

export interface TickerData {
  symbol: string;
  price: number; // last price
  changePct: number; // % change 24h
  change: number; // absolute change 24h
  high: number; // 24h high
  low: number; // 24h low
  volume: number; // 24h base asset volume
  open: number; // 24h open price
  bid: number; // best bid
  ask: number; // best ask
  trades: number; // number of trades in 24h
}
export interface PriceThreshold {
  [symbol: string]: {
    above?: number;
    below?: number;
  };
}
export const useBinanceTicker = (symbols: string[]) => {
  const [data, setData] = useState<Record<string, TickerData>>({});
  const thresholds: any = {
    BTCUSDT: { above: 95000, below: 30000 },
    ETHUSDT: { above: 4000 },
  };
  const checkPriceThreshold = (symbol: string, price: number) => {
    const threshold = thresholds[symbol];
    if (!threshold) return;

    if (threshold.above && price > threshold.above) {
      alert(
        `${symbol} has crossed above ${threshold.above}! Current price: ${price}`
      );
    }

    if (threshold.below && price < threshold.below) {
      alert(
        `${symbol} has dropped below ${threshold.below}! Current price: ${price}`
      );
    }
  };
  useEffect(() => {
    const streams = symbols.map((s) => `${s.toLowerCase()}@ticker`).join("/");
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/stream?streams=${streams}`
    );

    ws.onmessage = (msg) => {
      const parsed = JSON.parse(msg.data);
      if (!parsed.data) return;

      const payload = parsed.data;
      const symbol = payload.s;
      const price = parseFloat(payload.c);
      checkPriceThreshold(symbol, price);

      setData((prev) => ({
        ...prev,
        [symbol]: {
          symbol,
          price: parseFloat(payload.c),
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
      }));
    };

    return () => ws.close();
  }, [symbols]);

  return data;
};
