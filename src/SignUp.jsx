import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { whiteSuccessMessageFunction } from "./utils/whiteSuccessMessageFunction.jsx";
import { whiteFailMessageFunction } from "./utils/whiteFailMessageFunction.jsx";
import supabase from "./utils/supabase.js";
import { Link, useNavigate } from "react-router-dom";
import toggleWithDelay from "./utils/toggleWithDelay.js";

export default function SignUp() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    pledged_minutes: "",
  });
  const [signedUp, setSignedUp] = useState(false);
  const [succMsg, setSuccMsg] = useState("");
  const [error, setError] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);

  const navigate = useNavigate();

  function togglePassword() {
    setPasswordHidden(!passwordHidden);
  }

  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    setForm((values) => ({ ...values, [name]: value }));
  }

  function onError(failmsg) {
    setError(failmsg);
    toggleWithDelay(setSignedUp, false, null, 2000);
  }

  const sendForm = async (form) => {
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
      console.error(error.message);
      toggleWithDelay(setError, error.message, "", 2000);
    } else {
      setSignedUp(true);
      setSuccMsg("sign up successful!");
      setTimeout(() => {
        setSuccMsg("");
        navigate("/login");
      }, 2000);
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
    <Card>
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              mt: -2,
              color: "silver",
              bgcolor: "transparent",
              mr: "1px",
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <h1 style={{ margin: "0%" }}>Sign up</h1>
          <Stack spacing={1.5}>
            <TextField
              size="small"
              className="text-field"
              label="First name"
              placeholder="John"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="first_name"
              name="first_name"
              value={form.first_name}
              autoComplete="first_name"
              autoFocus
              type="text"
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
            <Typography></Typography>
            <TextField
              size="small"
              className="text-field"
              label="Last name"
              placeholder="Doe"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="last_name"
              name="last_name"
              value={form.last_name}
              autoComplete="last_name"
              autoFocus
              type="text"
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
            <Typography></Typography>
            <TextField
              size="small"
              label="Email"
              placeholder="your@email.com"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              value={form.email}
              autoComplete="email"
              autoFocus
              type="email"
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
            <Typography></Typography>
            <TextField
              size="small"
              label="Password"
              placeholder={passwordHidden ? "●●●●●●" : "password"}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              value={form.password}
              type={passwordHidden ? "password" : "text"}
              id="password"
              autoComplete="password"
              onChange={handleChange}
              onKeyDown={handleEnter}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePassword}
                      edge="end"
                    >
                      {passwordHidden ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Typography></Typography>
            <TextField
              size="small"
              className="text-field"
              label="Pledged minutes"
              placeholder="300"
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="pledged_minutes"
              name="pledged_minutes"
              value={form.pledged_minutes}
              autoFocus
              type="number"
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
            <Typography></Typography>
            <Button type="submit" size="small" fullWidth variant="contained">
              Sign up
            </Button>

            {succMsg && whiteSuccessMessageFunction(succMsg)}
            {error && whiteFailMessageFunction(error)}
            <Box component="span" sx={{ display: "inline-block" }}>
              <Link
                style={{ color: "#1976D2", fontSize: "75%" }}
                variant="body2"
                to={"/login"}
              >
                {"Already have an account?"}
              </Link>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
