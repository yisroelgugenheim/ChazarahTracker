import { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import supabase from "./utils/supabase";
import { getUserId } from "./utils/getUserId";
import { whiteSuccessMessageFunction } from "./utils/whiteSuccessMessageFunction";
import { whiteFailMessageFunction } from "./utils/whiteFailMessageFunction";
import toggleWithDelay from "./utils/toggleWithDelay.js";

export default function ChangeEmailRequest() {
  const [error, setError] = useState("");
  const [form, setForm] = useState({ email: "" });
  const [succMsg, setSuccMsg] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserId().then((id) => setUser(id));
  });

  const submitEmailChangeRequest = async (e) => {
    e.preventDefault();

    if (!user) return;
    const { data, error } = await supabase.auth.updateUser({
      email: form.email,
      data: {
        email_change_requested_at: new Date().toISOString(),
      },
    });

    if (error) {
      console.log(error);
      toggleWithDelay(setError, error.message, "", 1000);
      return;
    }
    if (form.email === "") {
      toggleWithDelay(setError, "must provide new email before submitting", "", 2000);
    }
    console.log(data);
    setSuccMsg("Check your new email for a confirmation link");
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <Card>
      <CardContent>
        <Box
          component="form"
          onSubmit={submitEmailChangeRequest}
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
          <h1>Reset email</h1>
          <Stack spacing={1.5}>
            <Typography></Typography>
            <TextField
              size="small"
              className="text-field"
              label="New email"
              placeholder="new@email.com"
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
            {succMsg && whiteSuccessMessageFunction(succMsg)}
            {error && whiteFailMessageFunction(error)}

            <Typography></Typography>
            <Typography></Typography>
            <Typography></Typography>
            <Button size="small" type="submit" fullWidth variant="contained">
              Submit for email update
            </Button>
            <Typography></Typography>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
