import * as React from "react"
import ToggleButton from "@mui/material/ToggleButton"
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup"
import { INTERVALS } from "../constants"
import type { Interval } from "../types"

interface ToggleIntervalsProps {
  interval: Interval
  setInterval: (interval: Interval) => void
}

const ToggleIntervals: React.FC<ToggleIntervalsProps> = ({
  interval,
  setInterval,
}: ToggleIntervalsProps) => {
  const handleAlignment = (
    _: React.MouseEvent<HTMLElement>,
    newInterval: string
  ) => {
    setInterval(newInterval as Interval)
  }

  return (
    <ToggleButtonGroup
      value={interval}
      exclusive
      onChange={handleAlignment}
      aria-label="OHLC Interval"
      sx={{ my: 2 }}
    >
      {INTERVALS.map((time) => (
        <ToggleButton key={time} value={time} aria-label={time}>
          {time}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  )
}
export default ToggleIntervals
