import { Container, Grid } from "@mui/material"
import { SnackbarProvider } from "notistack"
import { useState } from "react"
import CandleStickChart from "./components/CandleStickChart"
import Watchlist from "./components/Watchlist"
import { useTicketLiveStream } from "./hooks/useTicketLiveStream"
import type { TickerSymbol } from "./types"
import { popularTickers } from "./constants"
import { PopularTickers } from "./components/PopularTickers"

export default function App() {
  const tickersLiveStream = useTicketLiveStream()
  const [selectedTicker, setSelected] = useState<TickerSymbol>(
    popularTickers[0]
  )

  return (
    <SnackbarProvider
      maxSnack={5}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      autoHideDuration={3000}
      preventDuplicate
    >
      <Container sx={{ py: 4 }}>
        <Grid container spacing={3} mt={1}>
          <PopularTickers
            tickersLiveStream={tickersLiveStream}
            onSelect={setSelected}
            selectedTicker={selectedTicker}
          />
          <Grid size={{ xs: 12, sm: 12, lg: 8 }}>
            <CandleStickChart selectedTicker={selectedTicker} />
          </Grid>
          <Grid size={{ xs: 12, sm: 4, lg: 4 }}>
            <Watchlist
              tickers={tickersLiveStream}
              onSelect={setSelected}
              selectedTicker={selectedTicker}
            />
          </Grid>
        </Grid>
      </Container>
    </SnackbarProvider>
  )
}
