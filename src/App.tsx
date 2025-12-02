// src/App.tsx
import { Button, Container, Grid } from "@mui/material"
import TopTickers from "./components/TopTickers"
import CryptoChart from "./components/CryptoChart"
import Watchlist from "./components/Watchlist"
import { useState } from "react"
import { useBinanceTicker } from "./hooks/useBinanceTicker"
import Dashboard from "./components/Dashboard"
import CandleStickChart from "./components/CandleStickChart"
import type { PopularPairKeys } from "./constants"
import PriceAlert from "./components/PriceAlert"
import { SnackbarProvider } from "notistack"
import { enqueueSnackbar } from "notistack"

const allSymbols = [
  "BTCUSDT",
  "ETHUSDT",
  "BNBUSDT",
  "XRPUSDT",
  "ADAUSDT",
  "SOLUSDT",
  "DOGEUSDT",
  "AVAXUSDT",
  "DOTUSDT",
  "LTCUSDT",
  "TRXUSDT",
  "LINKUSDT",
  "ATOMUSDT",
  "ETCUSDT",
]

export default function App() {
  const { data: tickers } = useBinanceTicker(allSymbols)
  const [selectedTicker, setSelected] = useState("BTCUSDT")

  return (
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={3000}
      preventDuplicate
    >
      <Container sx={{ py: 4 }}>
        <Grid container spacing={3} mt={1}>
          <TopTickers
            tickers={tickers}
            onSelect={setSelected}
            selectedTicker={selectedTicker}
          />
          {/* <Grid size={{ xs: 12, sm: 8, lg: 12 }}>
          <Dashboard selectedTicker={selectedTicker} />
        </Grid> */}
          <Grid size={{ xs: 12, sm: 12, lg: 8 }}>
            <CandleStickChart
              symbol={selectedTicker}
              // contractType="current_quarter"
              // interval="1m"
            />
          </Grid>
          {/* LEFT CHART */}
          {/* <Grid size={{ xs: 12, sm: 8, lg: 8 }}>
          <CryptoChart
            selected={selectedTicker}
            price={tickers[selectedTicker]?.price}
          />
        </Grid> */}

          {/* RIGHT WATCHLIST */}
          <Grid size={{ xs: 12, sm: 4, lg: 4 }}>
            <Watchlist
              tickers={tickers}
              onSelect={setSelected}
              selectedTicker={selectedTicker}
            />
          </Grid>
          {/* {alerts.map((alert, idx) => (
            <PriceAlert
              key={idx}
              open={triggered[alert.ticker]}
              status={alert.status}
              ticker={alert.ticker}
            />
          ))} */}
        </Grid>
      </Container>
    </SnackbarProvider>
  )
}
