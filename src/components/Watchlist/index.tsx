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
import { formatPrice, formatVolume } from "../../util"
import PriceChange from "../PriceChange"
import { container, listItemStyles, title } from "./styles"
interface WatchlistProps {
  tickersLiveStream: TickerStreamDataMap
  onSelect: (sym: TickerSymbol) => void
  selectedTicker: TickerSymbol
}

const Watchlist: React.FC<WatchlistProps> = ({
  tickersLiveStream,
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
          const tickerData = tickersLiveStream[ticker]
          const up = (tickerData?.changePct ?? 0) > 0
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
                      <Stack sx={title}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold" }}
                        >
                          {TickerPairs[ticker]}
                        </Typography>
                        <PriceChange up={up} changePct={tickerData.changePct} />
                      </Stack>
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
                            {formatPrice(tickerData.price, tickerData.symbol)}
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
