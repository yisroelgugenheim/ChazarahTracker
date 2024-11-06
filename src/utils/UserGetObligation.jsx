import { useEffect, useState } from "react";
import supabase from "./supabase";
import { getUserId } from "./getUserId";
import { partitionUserQuarters, quarterRanges } from "./Quarters.js";
import toggleWithDelay from "./toggleWithDelay.js";

export function UserGetObligation() {
  const [userId, setUserId] = useState("");
  const [, setUserData] = useState(null);
  const [owedMsg, setOwedMsg] = useState("");

  useEffect(() => {
    // Fetch the user ID once when the component mounts
    getUserId().then((id) => {
      setUserId(id);
    });
  }, []);

  const fetchOwed = async () => {
    if (!userId) return;

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select(
        `
        user_id,
        first_name,
        last_name,
        email,
        pledged_minutes,
        sessions ( created_at, session_length ),
        payments ( created_at, amount )
        `
      )
      .eq("user_id", userId)
      .single(); // Fetch only one user

    if (userError) {
      console.error(userError);
      toggleWithDelay(setOwedMsg, "Error fetching user data.", "", 4000);
      return;
    }

    const processedUserData = partitionUserQuarters(userData);
    setUserData(processedUserData);

    // Determine the current quarter
    const now = new Date();

    const currentQuarterIndex =
      quarterRanges.findIndex(([, endDate]) => now <= new Date(endDate));

    // Calculate the obligation for the current quarter
    const currentObligation = processedUserData.quarters[currentQuarterIndex];

    // Display the user's financial obligation based on the current quarter
    const owedMsg =
      (currentObligation > 0) ?
        `Your current financial obligation is $${currentObligation.toFixed(2)}` :
        "You have no current financial obligation";

    toggleWithDelay(setOwedMsg, owedMsg, "", 4000);
  };

  return { fetchOwed, owedMsg };
}
