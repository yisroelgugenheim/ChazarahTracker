import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { whiteSuccessMessageFunction } from "../utils/whiteSuccessMessageFunction";
import { whiteFailMessageFunction } from "../utils/whiteFailMessageFunction";
import supabase from "../utils/supabase.js";
import toggleWithDelay from "../utils/toggleWithDelay.js";

// ignore code untill Signup function.
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function AddUser({ onClick, handleClick }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    pledged_minutes: "",
  });
  const [signedUp, setSignedUp] = useState(null);
  const [sgnSuccMsg, setSgnSuccMsg] = useState("");
  const [error, setError] = useState("");

  function onSuccess(succmsg) {
    setSgnSuccMsg(succmsg);
    toggleWithDelay(setSignedUp, true, null, 2000);
  }

  function onError(failmsg) {
    setError(failmsg);
    toggleWithDelay(setSignedUp, false, null, 2000);
  }

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setForm((values) => ({ ...values, [name]: value }));
  }

  const sendForm = async (form) => {
    // post signup form
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.first_name,
          last_name: form.last_name,
          pledged_minutes: form.pledged_minutes,
        },
      },
    });
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      pledged_minutes: "",
    });
    if (error) {
      console.error(error);
      onError(error.message);
    } else {
      console.dir(data);
      onSuccess(data.message);
    }
  };

  function handleEnter(e) {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendForm(form);
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        {/* <h2>CHAZARAH MINUTES TRACKER</h2> */}
        <CssBaseline />
        <Box
          sx={{
            marginTop: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, mt: -4, bgcolor: "transparent", mr: "1px" }}>
            <LockOutlinedIcon sx={{}} />
          </Avatar>
          {/* <Typography component="h1" variant="h5">
            Sign up
          </Typography> */}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {/* <Grid container spacing={2}>
              <Grid item xs={12} sm={6}> */}
            <TextField
              label="First Name"
              placeholder="First Name"
              variant="outlined"
              autoComplete="given-name"
              name="first_name"
              value={form.first_name}
              required
              fullWidth
              id="first_name"
              autoFocus
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
            {/* </Grid>
              <Grid item xs={12} sm={6}> */}
            <TextField
              label="Last Name"
              placeholder="Last Name"
              variant="outlined"
              required
              fullWidth
              id="last_name"
              name="last_name"
              value={form.last_name}
              autoComplete="family-name"
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
            {/* </Grid>
              <Grid item xs={12}> */}
            <TextField
              label="Email Address"
              placeholder="Email Address"
              variant="outlined"
              required
              fullWidth
              id="email"
              name="email"
              value={form.email}
              autoComplete="email"
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
            {/* </Grid>
              <Grid item xs={12}> */}

            <TextField
              label="Password"
              placeholder="Password"
              variant="outlined"
              required
              fullWidth
              name="password"
              value={form.password}
              type="password"
              id="password"
              autoComplete="new-password"
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
            {/* </Grid>
                <Grid item xs={12}> */}
            <TextField
              label="number of pledged minutes per week i.e. 50, 200"
              placeholder="i.e. 50, 500"
              variant="outlined"
              required
              fullWidth
              type="number"
              name="pledged_minutes"
              value={form.pledged_minutes}
              id="pledged_minutes"
              autoComplete="pledged-minutes"
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
            {/* </Grid> */}

            {/* <Grid item xs={12}>
              </Grid> */}
            {/* </Grid> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: -1, mb: 0 }}
            >
              Sign Up
            </Button>
            {signedUp === false && whiteFailMessageFunction(error)}
            {signedUp && whiteSuccessMessageFunction(sgnSuccMsg)}
            <Grid container justifyContent="flex-end">
              <Grid item></Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4, color: "transparent" }} />
      </Container>
    </ThemeProvider>
  );
}
