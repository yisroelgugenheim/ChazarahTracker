import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import supabase from "../utils/supabase";
import { whiteSuccessMessageFunction } from "../utils/whiteSuccessMessageFunction";
import { whiteFailMessageFunction } from "../utils/whiteFailMessageFunction";
import toggleWithDelay from "../utils/toggleWithDelay.js";

export default function UpdateSesLength({
  selectedSessionId,
  selectedUserId,
  sessionLength,
  setSessionLength,
}) {
  const [succMsg, setSuccMsg] = useState("");
  const [error, setError] = useState("");

  function handleChange(e) {
    setSessionLength(e.target.value);
  }

  async function updateMins() {
    const { data, error } = await supabase
      .from("sessions")
      .update({ session_length: sessionLength })
      .eq("session_id", selectedSessionId)
      .eq("user_id", selectedUserId)
      .select();
    if (error) {
      toggleWithDelay(setError, error.message, "", 2000);
      console.log(error);
      return;
    }
    toggleWithDelay(setSuccMsg, "success!", "", 2000);

    console.log(data);
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateMins();
  }
  return (
    <>
      {error && whiteFailMessageFunction(error)}
      {succMsg && whiteSuccessMessageFunction(succMsg)}
      <form>
        <Button
          style={{ margin: "10px" }}
          variant="contained"
          color="primary"
          disabled={!selectedSessionId || !sessionLength}
          onClick={handleSubmit}
        >
          {" "}
          Confirm & Update
        </Button>

        <TextField
          onChange={handleChange}
          margin="normal"
          required
          fullWidth
          id="session_length"
          label="New Session Length"
          name="session_length"
          placeholder="number of minutes i.e. 50, 200"
        />
      </form>
    </>
  );
}
