import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Skeleton,
  Stack,
} from "@mui/material"
import type { TickerData } from "../hooks/useBinanceTicker"
import { formatPrice, formatPercent, formatVolume } from "../utill"

const watchSymbols = [
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

interface Props {
  tickers: Record<string, TickerData>
  onSelect: (sym: string) => void
  selectedTicker: string
}

export default function Watchlist({
  tickers,
  onSelect,
  selectedTicker,
}: Props) {
  return (
    <Paper
      sx={{
        p: 2,
        height: 500,
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h6"
        mb={2}
        color="powderblue"
        sx={{ fontWeight: "bold" }}
      >
        Watchlist
      </Typography>

      <List disablePadding>
        {watchSymbols.map((sym) => {
          const t = tickers[sym]
          const up = t?.changePct > 0

          return (
            <ListItem key={sym} onClick={() => onSelect(sym)} sx={{ my: 2 }}>
              <ListItemButton>
                <ListItemText
                  primary={
                    t ? (
                      sym
                    ) : (
                      <Skeleton width={80} height={24} animation="wave" />
                    )
                  }
                  secondary={
                    t ? (
                      `Price: ${formatPrice(
                        t.price,
                        t.symbol
                      )} (${formatPercent(t.changePct)}) | High: ${formatPrice(
                        t.high,
                        t.symbol
                      )} | Low: ${formatPrice(
                        t.low,
                        t.symbol
                      )} | Vol: ${formatVolume(t.volume)}`
                    ) : (
                      <Stack spacing={0.5}>
                        <Skeleton width="100%" height={16} animation="wave" />
                        <Skeleton width="70%" height={16} animation="wave" />
                      </Stack>
                    )
                  }
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Paper>
  )
}
