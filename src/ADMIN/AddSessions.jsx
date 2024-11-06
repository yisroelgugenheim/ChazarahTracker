import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import supabase from "../utils/supabase";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { whiteSuccessMessageFunction } from "../utils/whiteSuccessMessageFunction";
import { whiteFailMessageFunction } from "../utils/whiteFailMessageFunction";
import toggleWithDelay from "../utils/toggleWithDelay.js";

function AddSessions({ selectedUserId }) {
  const [sessionLength, setSessionLength] = useState("");
  const [time, setTime] = useState(dayjs());
  const [succMsg, setSuccMsg] = useState("");
  const [error, setError] = useState("");

  const handleDateChange = (newVal) => {
    setTime(newVal); // Call the prop function with new value
    console.log(time);
    console.log(newVal);
  };

  const submitSession = async (e) => {
    e.preventDefault();
    if (!time || !sessionLength || !selectedUserId) return;
    const { data, error } = await supabase
      .from("sessions")
      .insert({
        user_id: selectedUserId,
        session_length: sessionLength,
        created_at: time.toISOString(),
      })
      .select();
    if (error) {
      console.log(error);
      toggleWithDelay(setError, error.message, "", 2000);
      return;
    }
    toggleWithDelay(setSuccMsg, "success!", "", 2000);
    console.log(data);
  };
  console.log(time);

  return (
    <>
      {error && whiteFailMessageFunction(error)}
      {succMsg && whiteSuccessMessageFunction(succMsg)}

      <Box
        component="form"
        onSubmit={submitSession}
        noValidate
        sx={{ mb: 5, ml: 15 }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            sx={{ width: 300, left: 200 }}
            label="Select DateTime"
            value={time}
            onChange={handleDateChange}
            slotProps={{
              textField: { variant: "outlined" },
            }}
          />
        </LocalizationProvider>

        <TextField
          style={{
            margin: "15px",
            marginLeft: "1px",
            width: "300px",
            marginTop: "0px",
          }}
          label="Session Length (minutes)"
          type="number"
          value={sessionLength}
          onChange={(e) => setSessionLength(e.target.value)}
          fullWidth
          sx={{ marginBottom: 2, left: 200 }}
        />

        <Button
          sx={{ mt: 0.2, height: 53, left: 200 }}
          variant="contained"
          color="primary"
          disabled={!selectedUserId || !sessionLength || !time}
          onClick={submitSession}
        >
          Add Minutes
        </Button>
      </Box>
    </>
  );
}

export default AddSessions;
