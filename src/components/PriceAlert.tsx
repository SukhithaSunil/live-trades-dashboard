import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import * as React from "react"
import type { PriceAlertData } from "../constants"

const PriceAlert: React.FC<PriceAlertData> = ({ open, status, ticker }) => {
  const [visible, setVisible] = React.useState(open)

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return
    setVisible(false)
  }
  return (
    <Snackbar
      open={visible}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={status} variant="filled">
        {`Price Alert for ${ticker} is Triggered!`}
      </Alert>
    </Snackbar>
  )
}
export default PriceAlert
