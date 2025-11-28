import React from "react";
import { useBTCUSDTPrice } from "../hooks/useBTCUSDTPrice";

const BTCPrice = () => {
  const price = useBTCUSDTPrice();

  return (
    <div>
      <h1>BTC/USDT</h1>
      <p>{price ? `$${price.toFixed(2)}` : "Loading..."}</p>
    </div>
  );
};

export default BTCPrice;
