import { createTheme } from "@mui/material";

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        light: "#ef7faf",
        main: "#EB609B",
        dark: "#a4436c",
      },
      secondary: {
        light: "#6fabf3",
        main: "#4C97F1",
        dark: "#3569a8",
      },
      ...(mode === "dark" && {
        background: {
          default: "#121212",
          paper: "#1e1e1e",
        },
      }),
    },
    typography: {
      fontFamily: "DSmargieTester, Roboto, sans-serif",
      h2: {
        position: "relative",
        top: "-20px",
      },
      h3: {
        position: "relative",
        top: "-20px",
      },
      h6: {
        position: "relative",
        top: "-8px",
      },
    },
  });
