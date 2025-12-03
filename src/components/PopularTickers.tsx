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
import { popularTickers, TickerPairs } from "../constants"
import type { TickerStreamDataMap, TickerSymbol } from "../types"
import { formatPercent, formatPrice } from "../utill"

interface PopularTickersProps {
  tickersLiveStream: TickerStreamDataMap
  onSelect: (sym: TickerSymbol) => void
  selectedTicker: TickerSymbol
}

export const PopularTickers: React.FC<PopularTickersProps> = ({
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
          <Grid key={ticket} size={{ xs: 6, sm: 3, lg: 3 }}>
            <Card
              sx={{
                backgroundColor:
                  selectedTicker === ticket ? "#374b6eff" : "#132344",
              }}
            >
              <CardActionArea
                onClick={() => onSelect(ticket)}
                sx={{
                  backgroundColor:
                    selectedTicker === ticket ? "action.selected" : "inherit",
                }}
              >
                <CardContent
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    sx={{
                      alignItems: { xs: "center" },
                      gap: { xs: 1 },
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {TickerPairs[ticket]}
                    </Typography>
                    {tickerData ? (
                      <Chip
                        size="small"
                        icon={up ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                        color={up ? "success" : "error"}
                        label={formatPercent(tickerData.changePct)}
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
                    <Typography variant="h6" color="darksalmon" sx={{ mt: 1 }}>
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
                  <Grid
                    container
                    spacing={2}
                    sx={{ display: { xs: "none", sm: "flex" }, mt: 1 }}
                  >
                    <Grid>
                      <Stack>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
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
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
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
