// src/hooks/useBinancePrices.ts
import { useEffect, useState } from "react";

export interface TickerPrice {
  symbol: string;
  price: number;
}

export function useBinancePrices(symbols: string[]) {
  const [prices, setPrices] = useState<TickerPrice[]>(
    symbols.map((s) => ({ symbol: s, price: 0 }))
  );

  useEffect(() => {
    const sockets: WebSocket[] = [];

    symbols.forEach((symbol) => {
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`
      );

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setPrices((prev) =>
          prev.map((p) =>
            p.symbol === symbol ? { ...p, price: parseFloat(data.p) } : p
          )
        );
      };

      sockets.push(ws);
    });

    return () => sockets.forEach((ws) => ws.close());
  }, [symbols]);

  return prices;
}
