import React from "react"
import MovingIcon from "@mui/icons-material/Moving"
import { Chip, Stack } from "@mui/material"
import { DownMovingIcon } from "../Watchlist/styles"
import { formatPercent } from "../../util"

interface PriceChangeProps {
  up: boolean
  changePct: number
}

const PriceChange: React.FC<PriceChangeProps> = ({ up, changePct }) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {up ? <MovingIcon color="success" /> : <DownMovingIcon color="error" />}
      <Chip
        size="small"
        color={up ? "success" : "error"}
        label={formatPercent(changePct)}
      />
    </Stack>
  )
}

export default PriceChange
