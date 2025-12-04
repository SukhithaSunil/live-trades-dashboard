import { Container, Grid } from "@mui/material"
import { SnackbarProvider } from "notistack"
import { useState } from "react"
import { CandleStickChart, PopularTickers, Watchlist } from "./components"
import { popularTickers } from "./constants"
import { useTicketLiveStream } from "./hooks/useTicketLiveStream"
import type { TickerSymbol } from "./types"

export default function App() {
  const { tickersLiveStream } = useTicketLiveStream()
  const [selectedTicker, setSelected] = useState<TickerSymbol>(
    popularTickers[0]
  )
  return (
    <SnackbarProvider
      maxSnack={3}
      hideIconVariant
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
            <CandleStickChart
              selectedTicker={selectedTicker}
              loading={!tickersLiveStream[selectedTicker]}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 12, lg: 4 }}>
            <Watchlist
              tickersLiveStream={tickersLiveStream}
              onSelect={setSelected}
              selectedTicker={selectedTicker}
            />
          </Grid>
        </Grid>
      </Container>
    </SnackbarProvider>
  )
}
