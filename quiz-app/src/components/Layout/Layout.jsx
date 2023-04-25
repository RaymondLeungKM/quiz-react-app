import * as React from "react";
import { Box } from "@mui/material";
import NavBar from "../Nav/NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {

  return (
    <>
      <Box>
        <NavBar />
      </Box>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
