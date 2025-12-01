// src/utils/format.ts
export const formatPrice = (price: number, symbol: string) => {
  if (!price) return "-";
  if (symbol.endsWith("USDT")) return `${price.toFixed(2)}`;
  if (symbol.startsWith("BTC") || symbol.startsWith("ETH"))
    return price.toFixed(2);
  return price.toFixed(6);
};

export const formatVolume = (volume: number) => {
  if (!volume) return "-";
  if (volume >= 1_000_000_000) return (volume / 1_000_000_000).toFixed(2) + "B";
  if (volume >= 1_000_000) return (volume / 1_000_000).toFixed(2) + "M";
  if (volume >= 1_000) return (volume / 1_000).toFixed(2) + "K";
  return volume.toFixed(2);
};

export const formatPercent = (percent: number) => {
  if (percent === undefined || percent === null) return "-";
  return percent.toFixed(2) + "%";
};
