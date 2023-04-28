// import viteLogo from "/vite.svg";
import "./App.css";
import "./index.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import * as React from "react";
import AppRoutes from "./router/routes.jsx";

import useMediaQuery from "@mui/material/useMediaQuery";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ColorModeContext from "./context/ColorModeContext";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider } from "notistack";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = React.useState("light");

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          // console.log("prevMode=" + prevMode);
          const mode = prevMode === "light" ? "dark" : "light";
          localStorage.setItem("colorMode", mode);
          return mode;
        });
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  // handle initial and subsequent color mode change based on user system settings
  React.useEffect(() => {
    // console.log("in prefersDarkMode useEffect");
    setMode(prefersDarkMode ? "dark" : "light");
  }, [prefersDarkMode]);

  // load user's preference for color mode on initial load; will override system preference
  React.useEffect(() => {
    // console.log("initial useEffect");
    const mode = prefersDarkMode ? "dark" : "light";
    let cachedColorMode =
      typeof localStorage != "undefined"
        ? localStorage.getItem("colorMode")
          ? localStorage.getItem("colorMode")
          : mode
        : mode;
    // console.log("cachedColorMode=", cachedColorMode);
    setMode(cachedColorMode);
  }, []);

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppRoutes />
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ horizontal: "right", vertical: "top" }}
          />
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}

export default App;
