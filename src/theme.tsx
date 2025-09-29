import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3AAFA9" },   // soft teal
    secondary: { main: "#FFB4A2" }, // warm muted coral
    background: { default: "#FAFBFB", paper: "#FFFFFF" },
    text: { primary: "#222831", secondary: "#4a4a4a" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: "1.6rem" },
    h2: { fontWeight: 600, fontSize: "1.2rem" },
  },
});

export default theme;
