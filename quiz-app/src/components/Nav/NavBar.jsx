import { useState, useContext, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { NavLink } from "react-router-dom";
import { routes } from "../../router/routes";

import ColorModeSwitch from "./ColorModeSwitch";
import UserContext from "../../context/UserContext";

const drawerWidth = 240;

function NavBar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navItems, setNavItems] = useState(routes);

  const { user } = useContext(UserContext);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  useEffect(() => {
    if (user != null) {
      console.log("user=", user);
      let loggedInRoutes;
      loggedInRoutes = navItems.filter((route) => route.name != "Login");
      if (user.isAdmin) {
        loggedInRoutes = loggedInRoutes.concat([
          { name: "Add Quiz", path: "/quiz/add" },
          { name: "Admin", path: "/admin" },
        ]);
      }
      loggedInRoutes = loggedInRoutes.concat([
        { name: "Quiz Result", path: "/quiz/result" },
        { name: "Logout", path: "/logout" },
      ]);
      setNavItems([...loggedInRoutes]);
    } else {
      setNavItems([...routes]);
    }
  }, [user]);

  const drawer = (
    <Box sx={{ textAlign: "center" }}>
      <Box onClick={handleDrawerToggle}>
        <Typography variant="h6" sx={{ my: 2 }}>
          QuizUp
        </Typography>
        <Divider />
        <List>
          {navItems.map((item) => (
            <NavLink to={item.path} key={item.name}>
              <ListItem disablePadding>
                <ListItemButton sx={{ textAlign: "center", color: (theme) => theme.palette.text.primary }}>
                  <ListItemText primary={item.name}/>
                </ListItemButton>
              </ListItem>
            </NavLink>
          ))}
        </List>
      </Box>
      <Box>
        <ColorModeSwitch />
      </Box>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <NavLink to="/">
              <Typography variant="h6" component="div" color="#fff">
                QuizUp
              </Typography>
            </NavLink>
          </Box>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <ColorModeSwitch />
          </Box>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <NavLink to={item.path} key={item.name}>
                <Button sx={{ color: "#fff" }}>{item.name}</Button>
              </NavLink>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

export default NavBar;
