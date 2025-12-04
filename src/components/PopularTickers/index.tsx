import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material"
import { popularTickers, TickerPairs } from "../../constants"
import type { TickerStreamDataMap, TickerSymbol } from "../../types"
import { formatPercent, formatPrice } from "../../util"
import {
  cardStyles,
  cardActionAreaStyles,
  cardContentStyles,
  stackStyles,
  chipStyles,
  priceStyles,
  gridContainerStyles,
  captionStyles,
} from "./styles"

interface PopularTickersProps {
  tickersLiveStream: TickerStreamDataMap
  onSelect: (sym: TickerSymbol) => void
  selectedTicker: TickerSymbol
}

const PopularTickers: React.FC<PopularTickersProps> = ({
  tickersLiveStream,
  onSelect,
  selectedTicker,
}) => {
  return (
    <>
      {popularTickers.map((ticket) => {
        const tickerData = tickersLiveStream[ticket]
        const up = (tickerData?.changePct ?? 0) > 0

        return (
          <Grid size={{ xs: 6, sm: 3, lg: 3 }} key={ticket}>
            <Card sx={cardStyles(selectedTicker === ticket)}>
              <CardActionArea
                onClick={() => onSelect(ticket)}
                sx={cardActionAreaStyles(selectedTicker === ticket)}
                aria-selected={selectedTicker === ticket}
              >
                <CardContent sx={cardContentStyles}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    sx={stackStyles}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {TickerPairs[ticket]}
                    </Typography>
                    {tickerData ? (
                      <Chip
                        size="small"
                        avatar={
                          up ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />
                        }
                        color={up ? "success" : "error"}
                        label={formatPercent(tickerData.changePct)}
                        sx={chipStyles}
                      />
                    ) : (
                      <Skeleton
                        width={60}
                        height={28}
                        variant="rounded"
                        animation="wave"
                      />
                    )}
                  </Stack>

                  {tickerData ? (
                    <Typography variant="subtitle1" sx={priceStyles}>
                      {tickerData.price}
                    </Typography>
                  ) : (
                    <Skeleton
                      width={80}
                      height={28}
                      sx={{ mt: 1 }}
                      animation="wave"
                    />
                  )}

                  <Grid container spacing={2} sx={gridContainerStyles}>
                    <Grid>
                      <Stack>
                        <Typography variant="caption" sx={captionStyles}>
                          24h High
                        </Typography>
                        {tickerData ? (
                          <Typography variant="caption">
                            {formatPrice(tickerData.high, tickerData.symbol)}
                          </Typography>
                        ) : (
                          <Skeleton width={60} height={16} />
                        )}
                      </Stack>
                    </Grid>
                    <Grid>
                      <Stack>
                        <Typography variant="caption" sx={captionStyles}>
                          24h Low
                        </Typography>
                        {tickerData ? (
                          <Typography variant="caption">
                            {formatPrice(tickerData.low, tickerData.symbol)}
                          </Typography>
                        ) : (
                          <Skeleton width={60} height={16} animation="wave" />
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        )
      })}
    </>
  )
}

export default PopularTickers
