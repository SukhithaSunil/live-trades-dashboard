// src/components/TickerList.tsx
import React from "react";
import type { TickerPrice } from "../hooks/useBinancePrices";

interface Props {
  prices: TickerPrice[];
  selected: string;
  onSelect: (symbol: string) => void;
}

const TickerList: React.FC<Props> = ({ prices, selected, onSelect }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {prices.map((p) => (
        <div
          key={p.symbol}
          onClick={() => onSelect(p.symbol)}
          style={{
            padding: "10px",
            background: selected === p.symbol ? "#3b82f6" : "#222",
            color: "white",
            cursor: "pointer",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{p.symbol}</span>
          <span>${p.price.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
};

export default TickerList;
