import {
  Typography,
  Link,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button
} from "@mui/material";
import {
  AccountCircle,
  Visibility,
  VisibilityOff,
  Key
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import UserContext from "./context/UserContext";

function Login() {
  const colorMode = useContext(ColorModeContext);
  
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const loginHandler = (e) => {
    e.preventDefault();
    console.log("in login handler")
  }

  return (
    <>
      <Box sx={{ border: "1px solid", borderRadius: 3, p: 6 }}>
        <Typography variant="h4" textAlign="center" mb={3}>
          Login
        </Typography>
        <form style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", margin: "2rem  0" }} onSubmit={loginHandler}>
          <FormControl sx={{ m: 1, width: "60%" }} variant="outlined">
            <InputLabel htmlFor="input-with-icon-adornment">Account</InputLabel>
            <OutlinedInput
              id="input-with-icon-adornment"
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              label="Account"
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "60%" }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              startAdornment={
                <InputAdornment position="start">
                  <Key />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Box sx={{ flexBasis: "100%", height: 0 }}></Box>
          <Button type="submit" variant="contained" sx={{ display: "block", width: "150px", mt: 3, p: 2}}>
            Login
          </Button>
        </form>

        <Typography>
          Doesn't have an account yet?
          <Link
            sx={{ ml: 1 }}
            component="button"
            onClick={() => {
              navigate("/register");
            }}
          >
            Register Now!
          </Link>
        </Typography>
      </Box>
    </>
  );
}

export default Login;
