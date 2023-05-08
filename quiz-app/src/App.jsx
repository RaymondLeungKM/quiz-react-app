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
import { Backdrop, CircularProgress } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ColorModeContext from "./context/ColorModeContext";
import UserContext from "./context/UserContext";
import BackdropContext from "./context/BackdropContext";
import CssBaseline from "@mui/material/CssBaseline";
import { SnackbarProvider, closeSnackbar, enqueueSnackbar } from "notistack";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const action = (snackbarId) => (
  <>
    <IconButton onClick={() => closeSnackbar(snackbarId)}>
      <CloseIcon fontSize="small" />
    </IconButton>
  </>
);

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [mode, setMode] = React.useState("light");

  const [user, setUser] = React.useState(null);

  const login = (user) => {
    enqueueSnackbar("Logged in successfully!", { variant: "success" });
    sessionStorage.setItem("user", JSON.stringify(user));
    setUser({ ...user });
  };

  const logout = () => {
    enqueueSnackbar("Logged out successfully!", { variant: "success" });
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("jwt");
    setUser(null);
  };

  const [backdropVisible, setBackdropVisible] = React.useState(false);

  const showBackdrop = () => {
    setBackdropVisible(true);
  };

  const hideBackdrop = () => {
    setBackdropVisible(false);
  };

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

  // load user from sessionStorage
  React.useEffect(() => {
    const cachedUser = JSON.parse(sessionStorage.getItem("user"));
    if (cachedUser) {
      setUser({ ...cachedUser });
    }
  }, []);

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <UserContext.Provider
          value={{ user: user, login: login, logout: logout }}
        >
          <BackdropContext.Provider
            value={{
              visible: backdropVisible,
              show: showBackdrop,
              hide: hideBackdrop,
            }}
          >
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppRoutes />
              <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{ horizontal: "right", vertical: "top" }}
                action={action}
              />
            </ThemeProvider>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={backdropVisible}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          </BackdropContext.Provider>
        </UserContext.Provider>
      </ColorModeContext.Provider>
    </>
  );
}

export default App;
