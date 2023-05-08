import {
  Typography,
  Link,
  Box,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import {
  AccountCircle,
  Visibility,
  VisibilityOff,
  Key,
  Email,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { register } from "./api/react-query-actions";
import UserContext from "./context/UserContext";
import jwt_decode from "jwt-decode";

import { enqueueSnackbar } from "notistack";

function Register() {
  const { login: loginUser } = useContext(UserContext);

  const [accountName, setAccountName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const registerHandler = (e) => {
    e.preventDefault();
    register(accountName, email, password).then(res=>{
      enqueueSnackbar("Account created successfully!", { variant: "success" });
      sessionStorage.setItem("jwt", res.token)
      const decodedToken = jwt_decode(res.token);
      loginUser({ ...decodedToken });
      navigate("/")
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <>
      <Box sx={{ border: "1px solid", borderRadius: 3, p: 6 }}>
        <Typography variant="h4" textAlign="center" mb={3}>
          Register
        </Typography>
        <form
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            margin: "2rem  0",
          }}
          onSubmit={registerHandler}
        >
          <FormControl sx={{ m: 1, width: "60%" }} variant="outlined">
            <InputLabel htmlFor="accountName">Account Name</InputLabel>
            <OutlinedInput
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              }
              label="Account Name<"
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "60%" }} variant="outlined">
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <Email />
                </InputAdornment>
              }
              label="Email"
            />
          </FormControl>
          <FormControl sx={{ m: 1, width: "60%" }} variant="outlined">
            <InputLabel htmlFor="password">Password</InputLabel>
            <OutlinedInput
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
          <Button
            type="submit"
            variant="contained"
            sx={{ display: "block", width: "150px", mt: 3, p: 2 }}
          >
            Submit
          </Button>
        </form>

        <Typography>
          Already have an account?
          <Link
            sx={{ ml: 1 }}
            component="button"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login Now!
          </Link>
        </Typography>
      </Box>
    </>
  );
}

export default Register;
