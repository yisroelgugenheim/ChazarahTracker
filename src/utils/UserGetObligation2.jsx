// excludes the current quarter from the sum
import { useEffect, useState } from "react";
import supabase from "./supabase";
import { getUserId } from "./getUserId";
import { partitionUserQuarters, quarterRanges } from "./Quarters.js";
import toggleWithDelay from "./toggleWithDelay.js";

export function UserGetObligation2() {
  const [userId, setUserId] = useState("");
  const [, setUserData] = useState(null);
  const [statsMsg, setStatsMsg] = useState("");

  useEffect(() => {
    // Fetch the user ID once when the component mounts
    getUserId().then((id) => {
      setUserId(id);
    });
  }, []);

  const handleFetchData = async () => {
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
      toggleWithDelay(setStatsMsg, "Error fetching user data.", "", 4000);
      return;
    }

    const processedUserData = partitionUserQuarters(userData);
    setUserData(processedUserData);

    // Determine the current quarter based on today's date
    const now = new Date();
    const currentQuarterIndex =
      quarterRanges.findIndex(([, endDate]) => now <= new Date(endDate));

    // If we are currently in a quarter, sum up to the previous quarter
    const quartersToSum = currentQuarterIndex > 0 ? currentQuarterIndex : 0;

    // Calculate the total obligation up to, but not including, the current quarter
    const totalObligation = processedUserData.quarters
      .slice(0, quartersToSum) // Sum up to, but not including, the current quarter
      .reduce((sum, obligation) => Math.max(sum, obligation), 0);

    // Display the user's financial obligation up to the current quarter
    if (totalObligation > 0) {
      setStatsMsg(
        `Your current financial obligation is $${totalObligation.toFixed(2)}`
      );
    } else {
      setStatsMsg("You have no current financial obligation");
    }
  };

  return { handleFetchData, statsMsg };
}
