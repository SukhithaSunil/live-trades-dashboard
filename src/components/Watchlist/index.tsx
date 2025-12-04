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
import { TickerPairs, watchlist } from "../../constants"
import type { TickerStreamDataMap, TickerSymbol } from "../../types"
import { formatPercent, formatPrice, formatVolume } from "../../util"
import { container, listItemStyles } from "./styles"

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
    <Paper sx={container}>
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
              sx={listItemStyles(selectedTicker === ticker)}
            >
              <ListItemButton
                onClick={() => onSelect(ticker)}
                aria-selected={selectedTicker === ticker}
              >
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
                      <>
                        <Stack direction="row" flexWrap="wrap" spacing={1}>
                          <Typography variant="body2">
                            Price:{" "}
                            {formatPrice(tickerData.price, tickerData.symbol)} (
                            {formatPercent(tickerData.changePct)})
                          </Typography>
                          <Typography variant="body2">
                            High:{" "}
                            {formatPrice(tickerData.high, tickerData.symbol)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" flexWrap="wrap" spacing={1}>
                          <Typography variant="body2">
                            Low:{" "}
                            {formatPrice(tickerData.low, tickerData.symbol)}
                          </Typography>
                          <Typography variant="body2">
                            Vol: {formatVolume(tickerData.volume)}
                          </Typography>
                        </Stack>
                      </>
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
