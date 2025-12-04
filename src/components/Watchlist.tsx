import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material"
import { TickerPairs, watchlist } from "../constants"
import type { TickerStreamDataMap, TickerSymbol } from "../types"
import { formatPercent, formatPrice, formatVolume } from "../utill"

interface WatchlistProps {
  tickers: TickerStreamDataMap
  onSelect: (sym: TickerSymbol) => void
  selectedTicker: TickerSymbol
}

const Watchlist: React.FC<WatchlistProps> = ({
  tickers,
  onSelect,
  selectedTicker,
}) => {
  return (
    <Paper
      sx={{
        p: 2,
        height: 550,
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#0d1b3a",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#374b6eff",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#566fae",
        },
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
        {watchlist.map((ticker: TickerSymbol) => {
          const tickerData = tickers[ticker]
          return (
            <ListItem
              key={ticker}
              onClick={() => onSelect(ticker)}
              sx={{
                my: 2,
                backgroundColor:
                  selectedTicker === ticker ? "#374b6eff" : "#132344",
              }}
            >
              <ListItemButton>
                <ListItemText
                  primary={
                    tickerData ? (
                      TickerPairs[ticker]
                    ) : (
                      <Skeleton width={80} height={24} animation="wave" />
                    )
                  }
                  secondary={
                    tickerData ? (
                      `Price: ${formatPrice(
                        tickerData.price,
                        tickerData.symbol
                      )} (${formatPercent(
                        tickerData.changePct
                      )}) | High: ${formatPrice(
                        tickerData.high,
                        tickerData.symbol
                      )} | Low: ${formatPrice(
                        tickerData.low,
                        tickerData.symbol
                      )} | Vol: ${formatVolume(tickerData.volume)}`
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
export default Watchlist
