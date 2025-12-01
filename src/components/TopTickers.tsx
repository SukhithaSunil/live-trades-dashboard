import {
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
  Skeleton,
  CardActionArea,
} from "@mui/material"
import type { TickerData } from "../hooks/useBinanceTicker"
import { formatPrice, formatPercent } from "../utill"
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward"
import { PopularPairs, popularTickers } from "../constants"

interface Props {
  tickers: Record<string, TickerData>
  onSelect: (sym: string) => void
  selectedTicker: string
}

export default function TopTickers({
  tickers,
  onSelect,
  selectedTicker,
}: Props) {
  return (
    <>
      {popularTickers.map((sym) => {
        const t = tickers[sym]
        const up = t?.changePct > 0

        return (
          <Grid key={sym} size={{ xs: 6, sm: 3, lg: 3 }}>
            <Card>
              <CardActionArea
                onClick={() => onSelect(sym)}
                data-active={selectedTicker === sym ? "" : undefined}
                sx={{
                  backgroundColor:
                    selectedTicker === sym ? "action.selected" : "inherit",
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
                    {/* Symbol */}
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {PopularPairs[sym]}
                    </Typography>

                    {/* Percent change chip OR skeleton */}
                    {t ? (
                      <Chip
                        size="small"
                        icon={up ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                        color={up ? "success" : "error"}
                        label={formatPercent(t.changePct)}
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

                  {/* Price */}
                  {t ? (
                    <Typography variant="h6" color="darksalmon" sx={{ mt: 1 }}>
                      {t.price}
                    </Typography>
                  ) : (
                    <Skeleton
                      width={80}
                      height={28}
                      sx={{ mt: 1 }}
                      animation="wave"
                    />
                  )}

                  {/* Details grid (hidden on xs) */}
                  <Grid
                    container
                    spacing={2}
                    sx={{ display: { xs: "none", sm: "flex" }, mt: 1 }}
                  >
                    {/* High */}
                    <Grid>
                      <Stack>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          24h High
                        </Typography>

                        {t ? (
                          <Typography variant="caption">
                            {formatPrice(t.high, t.symbol)}
                          </Typography>
                        ) : (
                          <Skeleton width={60} height={16} />
                        )}
                      </Stack>
                    </Grid>

                    {/* Low */}
                    <Grid>
                      <Stack>
                        <Typography
                          variant="caption"
                          sx={{ color: "text.secondary" }}
                        >
                          24h Low
                        </Typography>

                        {t ? (
                          <Typography variant="caption">
                            {formatPrice(t.low, t.symbol)}
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
