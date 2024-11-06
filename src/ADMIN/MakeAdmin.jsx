import { useState } from "react";
import supabase from "../utils/supabase";
import Button from "@mui/material/Button";
import { whiteSuccessMessageFunction } from "../utils/whiteSuccessMessageFunction";
import { whiteFailMessageFunction } from "../utils/whiteFailMessageFunction";
import toggleWithDelay from "../utils/toggleWithDelay.js";

export default function MakeAdmin({ selectedUserId }) {
  const [succMsg, setSuccMsg] = useState("");
  const [error, setError] = useState("");

  async function handleMakeAdmin() {
    const { data, error } = await supabase
      .from("users")
      .update({ admin: 1 })
      .eq("user_id", selectedUserId)
      .select();
    if (error) {
      toggleWithDelay(setError, error.message, "", 2000);
      return;
    }
    toggleWithDelay(setSuccMsg, "success!", "", 2000);
    console.log(data);
  }

  return (
    <>
      <Button
        type="submit"
        variant="contained"
        color="warning"
        disabled={!selectedUserId}
        sx={{
          marginTop: "-100px",
          left: "102%",
          top: "-1.2vmin",
          height: "8vmin",
        }}
        onClick={handleMakeAdmin}
      >
        Make Admin
      </Button>
      {error && whiteFailMessageFunction(error)}
      {succMsg && whiteSuccessMessageFunction(succMsg)}
    </>
  );
}
