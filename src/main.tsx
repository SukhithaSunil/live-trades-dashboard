import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import { MuiTheme } from "./config/MuiTheme.ts"

export const darkTheme = createTheme({
  palette: {
    // mode: "dark",

    background: {
      default: "#10152aff", // deep dark blue
      paper: "#111827", // navy panel
    },

    primary: {
      main: "#F0B90B", // Binance yellow
      contrastText: "#000",
    },

    secondary: {
      main: "#12C2E9", // cyan accent
      contrastText: "#fff",
    },

    text: {
      primary: "#EAECEF",
      secondary: "rgba(234,236,239,0.60)",
      disabled: "rgba(234,236,239,0.28)",
    },

    divider: "rgba(255,255,255,0.1)",

    error: { main: "#c54d50" },
    success: { main: "#5fd6a8ff" },
    warning: { main: "#F0B90B" },
  },

  typography: {
    fontFamily: `"Inter", "Roboto", sans-serif`,
    body1: { color: "#EAECEF" },
    body2: { color: "rgba(234,236,239,0.75)" },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#0a1b30ff",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.05)",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 4,
          padding: "8px 16px",
          color: "#EAECEF",
          transition: "background-color 0.2s",
          backgroundColor: "#0f254dff", // hover surface

          "&:hover": {
            backgroundColor: "#374b6eff", // hover surface
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#132344",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.06)",
          "&:hover": {
            backgroundColor: "#374b6eff", // hover surface
          },
          "&.Mui-selected": {
            backgroundColor: "#374b6eff", // hover surface
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          backgroundColor: "#F0B90B",
          color: "#000",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "#dba40a",
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          color: "#EAECEF",
          backgroundColor: "#05264fff",
          textTransform: "none",
          "&:hover": {
            backgroundColor: "#162447",
            border: "#25375bff",
          },
          "&.Mui-selected": {
            backgroundColor: "#25375bff",
            border: "#25375bff",
            "&:hover": {
              backgroundColor: "#010303ff",
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#162033", // elevated blue surface
          "& fieldset": {
            borderColor: "rgba(255,255,255,0.16)",
          },
          "&:hover fieldset": {
            borderColor: "#F0B90B",
          },
        },
        input: {
          color: "#EAECEF",
        },
      },
    },
  },
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
)
