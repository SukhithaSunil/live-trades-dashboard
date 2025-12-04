import type { SxProps, Theme } from "@mui/material"

export const cardStyles = (isSelected: boolean): SxProps<Theme> => ({
  backgroundColor: isSelected ? "#374b6eff" : "#132344",
})

export const cardActionAreaStyles = (isSelected: boolean): SxProps<Theme> => ({
  backgroundColor: isSelected ? "action.selected" : "inherit",
})

export const cardContentStyles: SxProps<Theme> = {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
}

export const stackStyles: SxProps<Theme> = {
  alignItems: { xs: "center" },
  gap: { xs: 1 },
}

export const chipStyles: SxProps<Theme> = {
  height: 24,
  fontSize: 12,
}

export const priceStyles: SxProps<Theme> = {
  mt: 1,
  color: "darksalmon",
}

export const gridContainerStyles: SxProps<Theme> = {
  display: { xs: "none", sm: "flex" },
  mt: 1,
}

export const captionStyles: SxProps<Theme> = {
  color: "text.secondary",
}
