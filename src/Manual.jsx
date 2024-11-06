import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import supabase from "./utils/supabase";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { whiteSuccessMessageFunction } from "./utils/whiteSuccessMessageFunction";
import { whiteFailMessageFunction } from "./utils/whiteFailMessageFunction";
import { getUserId } from "./utils/getUserId";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import toggleWithDelay from "./utils/toggleWithDelay.js";

export default function Manual() {
  const [sessionLength, setSessionLength] = useState("");
  const [time, setTime] = useState(dayjs());
  const [succMsg, setSuccMsg] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    async function getId() {
      const userId = await getUserId();
      setUserId(userId);
    }
    getId();
  }, []);

  const handleDateChange = (newVal) => {
    setTime(newVal); // Call the prop function with new value
  };

  const submitSession = async (e) => {
    e.preventDefault();
    if (!time || !sessionLength || !userId) return;
    const { data, error } = await supabase
      .from("sessions")
      .insert({
        user_id: userId,
        session_length: sessionLength,
        created_at: time.toISOString(),
      })
      .select();
    if (error) {
      toggleWithDelay(setError, error.message, "", 2000);
      return;
    }
    setSessionLength("");
    toggleWithDelay(setSuccMsg, "success!", "", 2000);
  };

  return (
    <>
      {error && whiteFailMessageFunction(error)}
      {succMsg && whiteSuccessMessageFunction(succMsg)}

      <Box component="form" onSubmit={submitSession} noValidate>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Stack spacing={2}>
            {
              <Alert severity="info">
                Selecting a date is not usually necessary, <br />
                as it defaults to the current time. <br />
                Recommended if adding for a previous quarter.
              </Alert>
            }

            <DateTimePicker
              aria-invalid="true"
              value={time}
              onChange={handleDateChange}
              slotProps={{
                textField: { variant: "outlined" },
              }}
            />

            <TextField
              label="Session Length (minutes)"
              type="number"
              value={sessionLength}
              onChange={(e) => setSessionLength(e.target.value)}
            />

            <Button
              variant="contained"
              color="primary"
              disabled={!userId || !sessionLength || !time}
              onClick={submitSession}
            >
              Add Minutes
            </Button>
          </Stack>
        </LocalizationProvider>
      </Box>
    </>
  );
}
