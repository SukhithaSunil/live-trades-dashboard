import { useState } from "react";
import { useBinancePrices } from "./hooks/useBinancePrices";
import TickerList from "./components/TickerList";
import RealTimeChart from "./components/RealTimeChart";

const tickers = ["btcusdt", "ethusdt", "bnbusdt", "adausdt", "xrpusdt"];
// src/constants/tickers.ts

import "./App.css";
import BTCPrice from "./components/BTCPrice";

function App() {
  const [selected, setSelected] = useState(tickers[0]);
  const prices = useBinancePrices(tickers);
  const selectedPrice = prices.find((p) => p.symbol === selected);

  return (
    <div style={{ display: "flex", padding: "20px", gap: "20px" }}>
      <div style={{ width: "200px" }}>
        <TickerList
          prices={prices}
          selected={selected}
          onSelect={setSelected}
        />
      </div>
      <div style={{ flex: 1 }}>
        <RealTimeChart price={selectedPrice} />
      </div>
    </div>
    // <BTCPrice />
  );
}

export default App;
