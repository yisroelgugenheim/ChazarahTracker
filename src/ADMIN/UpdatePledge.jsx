import { useState } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import supabase from "../utils/supabase";
import { whiteSuccessMessageFunction } from "../utils/whiteSuccessMessageFunction";
import { whiteFailMessageFunction } from "../utils/whiteFailMessageFunction";
import toggleWithDelay from "../utils/toggleWithDelay.js";

export default function UpdatePledge({ selectedUserId }) {
  const [newPledge, setNewPledge] = useState("");
  const [succMsg, setSuccMsg] = useState("");
  const [error, setError] = useState("");

  async function SubmitNewPledge(e) {
    e.preventDefault();
    const { data, error } = await supabase
      .from("users")
      .update({ pledged_minutes: newPledge })
      .eq("user_id", selectedUserId)
      .select();
    if (error) {
      setError(error.message);
      return;
    }
    if (!data || data.length < 1) {
      setError("Could not complete update. Please try again later.");
      return;
    }
    toggleWithDelay(setSuccMsg, "Pledge updated successfully!", "", 3000);
  }

  return (
    <>
      <Stack>
        <TextField
          variant="outlined"
          type="number"
          label="
        new pledge"
          onChange={(e) => {
            setNewPledge(e.target.value);
          }}
        />
        <Button
          type="submit"
          onClick={SubmitNewPledge}
          color="warning"
          variant="contained"
          disabled={!selectedUserId || !newPledge}
          sx={{ marginTop: "5%" }}
        >
          Confirm Pledge Update
        </Button>
      </Stack>

      {succMsg && whiteSuccessMessageFunction(succMsg)}
      {error && whiteFailMessageFunction(error)}
    </>
  );
}
