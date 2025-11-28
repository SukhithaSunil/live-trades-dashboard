import { useEffect, useState } from "react";

export function useBTCUSDTPrice() {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.onopen = () => console.log("Connected to BTC/USDT WebSocket");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setPrice(parseFloat(data.p)); // update price
    };

    ws.onerror = (err) => console.error("WebSocket error:", err);

    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, []);

  return price;
}
