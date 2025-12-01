import { createTheme } from "@mui/material/styles";

export const MuiTheme = () => {
  const newTheme = createTheme({
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            background:
              "linear-gradient(45deg, #F2E2BA, transparent 25% 75%, #F2E2BA), linear-gradient(135deg, #e5eafb, #ffff 25% 75%, #e5eafb)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
    },
    palette: {
      mode: "light",
      primary: {
        main: "#424242",
      },
      secondary: {
        main: "#00897b",
        contrastText: "blue",
      },
      error: {
        main: "#1a237e",
      },
      text: {
        secondary: "#607d8b",
        primary: "#37474f",
      },
    },
    typography: {
      h5: {
        "@media (max-width:600px)": {
          fontSize: "1.25rem",
        },
      },
    },
  });
  return newTheme;
};
