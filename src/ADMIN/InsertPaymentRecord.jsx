import { useState } from "react";
import supabase from "../utils/supabase";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { whiteSuccessMessageFunction } from "../utils/whiteSuccessMessageFunction";
import { whiteFailMessageFunction } from "../utils/whiteFailMessageFunction";
import toggleWithDelay from "../utils/toggleWithDelay.js";

export default function InsertPaymentRecord({ selectedUserId }) {
  const [amount, setAmount] = useState("");
  const [succMsg, setSuccMsg] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!selectedUserId) {
      toggleWithDelay(setError, "selected user is required", "", 2000);

      return;
    } else if (!amount) {
      toggleWithDelay(setError, "amount is required", "", 2000);
      return;
    }
    const { data, error } = await supabase
      .from("payments")
      .insert({ user_id: selectedUserId, amount: parseFloat(amount) });

    if (error) {
      console.error("Error inserting payment:", error);
      toggleWithDelay(setError, "failed to insert payment record!", "", 2000);
    } else {
      toggleWithDelay(setSuccMsg, "payment record successfully inserted!", "", 2000);
      setAmount("");
    }
  };

  return (
    <div>
      <h2 style={{ fontFamily: "sans-serif" }}>Enter Amount Paid</h2>
      <div>
        <TextField
          type="number"
          label="payment amount"
          placeholder="50.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        style={{ marginTop: 10, marginLeft: -3 }}
        variant="contained"
        onClick={handleSubmit}
      >
        Insert Payment Record
      </Button>
      {error && whiteFailMessageFunction(error)}
      {succMsg && whiteSuccessMessageFunction(succMsg)}
    </div>
  );
}
