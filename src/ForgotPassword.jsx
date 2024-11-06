import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import supabase from "./utils/supabase";
import { whiteSuccessMessageFunction } from "./utils/whiteSuccessMessageFunction";
import { whiteFailMessageFunction } from "./utils/whiteFailMessageFunction";
import toggleWithDelay from "./utils/toggleWithDelay.js";

export default function ForgotPassword() {
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "" });
  const [resetMsg, setResetMsg] = useState("");

  const submitEmailForPWReset = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.resetPasswordForEmail(
      form.email,
      {
        redirectTo: "https://chazarahtracker.org/reset-password",
      }
    );

    if (error) {
      console.log(error);
      toggleWithDelay(setError, error.message, "", 1000);
      return;
    }
    console.log(data);
    toggleWithDelay(setResetMsg, "Check your email for password reset link", "", 5000);
  };
  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        window.location.href = "/reset-password";
      }
    });
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <Card>
      <CardContent>
        <Box
          component="form"
          onSubmit={submitEmailForPWReset}
          noValidate
          sx={{
            marginTop: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              mt: -1,
              color: "silver",
              bgcolor: "transparent",
              mr: "1px",
            }}
          >
            <LockOutlinedIcon />
          </Avatar>
          <h1>Confirm email</h1>
          <Stack spacing={1.5}>
            <Typography></Typography>
            <TextField
              size="small"
              className="text-field"
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
            />
            {error && whiteFailMessageFunction(error)}
            {resetMsg && whiteSuccessMessageFunction(resetMsg)}

            <Typography></Typography>
            <Typography></Typography>
            <Typography></Typography>
            <Button size="small" type="submit" fullWidth variant="contained">
              Submit for password reset
            </Button>
            <Typography></Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
