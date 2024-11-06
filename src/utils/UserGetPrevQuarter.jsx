import { useEffect, useState } from "react";
import supabase from "./supabase";
import { getPledge } from "./getPledge";
import { getUserId } from "./getUserId";
import { createPrevQuarterMessage } from "./createPrevQuarterMessage";
import { quarterRanges } from "./Quarters.js";

export function UserGetPrevQuarter() {
  const [userId, setUserId] = useState("");
  const [prevQMsg, setPrevQMsg] = useState("");

  useEffect(() => {
    getUserId().then((userId) => {
      setUserId(userId);
    });
  }, []);

  const fetchPrevQMins = async () => {
    if (!userId) return;

    // Determine the previous quarter
    const now = new Date();
    let previousQuarterIndex = 0;

    for (let i = 0; i < quarterRanges.length; i++) {
      const quarterEndDate = new Date(quarterRanges[i][1]);
      if (now <= quarterEndDate) {
        previousQuarterIndex = i - 1;
        break;
      }
    }

    if (previousQuarterIndex < 0) {
      previousQuarterIndex = quarterRanges.length - 1; // Wrap around to the last quarter of the previous year
    }

    const [start, end] = quarterRanges[previousQuarterIndex];

    const { data, error } = await supabase
      .from("sessions")
      .select()
      .eq("user_id", userId)
      .gte("created_at", new Date(start).toISOString())
      .lte("created_at", new Date(end).toISOString());

    if (error) {
      console.log(error);
      return null;
    }

    let quarterMinutes = 0;
    for (let session of data) {
      quarterMinutes += session.session_length;
    }

    const result = await getPledge(userId);
    if (!result || result.length === 0) {
      console.log("No pledge data found.");
      return;
    }
    const quarterPledge = result[0].pledged_minutes * 12;
    setPrevQMsg(createPrevQuarterMessage(quarterMinutes, quarterPledge));
  };

  return { fetchPrevQMins, prevQMsg };
}
