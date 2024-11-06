import { useState } from "react";
import supabase from "./utils/supabase";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { whiteSuccessMessageFunction } from "./utils/whiteSuccessMessageFunction";
import { whiteFailMessageFunction } from "./utils/whiteFailMessageFunction";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import toggleWithDelay from "./utils/toggleWithDelay.js";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [succMsg, setSuccMsg] = useState("");
  const [error, setError] = useState("");
  const [passwordHidden, setPasswordHidden] = useState(true);

  function togglePassword() {
    setPasswordHidden(!passwordHidden);
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      toggleWithDelay(setError, "no password!", "", 2000);

      return;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        toggleWithDelay(setError, error.message, "", 4000);
        return;
      }
      if (!data)
        throw new Error(
          "We were unuable to update your password at this time. Please try again later."
        );
      setSuccMsg("Password updated successfully!");
      setTimeout(() => {
        console.log(data);
        navigate("/login");
      }, 2000);
    } catch (error) {
      toggleWithDelay(setError, error.message, "", 4000);
    }
  };

  function handleChange(e) {
    setNewPassword(e.target.value);
  }
  return (
    <Card>
      <CardContent>
        <Box
          component="form"
          onSubmit={handlePasswordReset}
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
          <h1>Reset password</h1>
          <Stack spacing={1.5}>
            <Typography></Typography>
            {succMsg && whiteSuccessMessageFunction(succMsg)}
            {error && whiteFailMessageFunction(error)}

            <Typography></Typography>
            <Typography></Typography>
            <TextField
              size="small"
              label="New password"
              placeholder={passwordHidden ? "●●●●●●" : "password"}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              value={newPassword}
              type={passwordHidden ? "password" : "text"}
              id="password"
              autoComplete="password"
              onChange={handleChange}
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
            <Button size="small" type="submit" fullWidth variant="contained">
              Confirm and submit
            </Button>
            <Typography></Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
