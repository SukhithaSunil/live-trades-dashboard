import { styled, type SxProps, type Theme } from "@mui/material"
import MovingIcon from "@mui/icons-material/Moving"

export const container: SxProps<Theme> = {
  p: 2,
  height: 550,
  overflowY: "auto",
  "&::-webkit-scrollbar": { width: "8px" },
  "&::-webkit-scrollbar-track": { background: "#0d1b3a", borderRadius: "4px" },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#374b6eff",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#566fae" },
}

export const headerStyles: SxProps<Theme> = {
  mb: 2,
  color: "powderblue",
  fontWeight: "bold",
}

export const listItemStyles = (selected: boolean): SxProps<Theme> => ({
  my: 2,
  backgroundColor: selected ? "#374b6eff" : "#132344",
  borderRadius: 1,
})

export const DownMovingIcon = styled(MovingIcon)(({ theme }) => ({
  transform: "rotate(180deg)",
  color: theme.palette.error.main,
}))

export const title: SxProps<Theme> = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: 1,
}
