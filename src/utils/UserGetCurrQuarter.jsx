import { useEffect, useState } from "react";
import supabase from "./supabase";
import { getPledge } from "./getPledge";
import { getUserId } from "./getUserId";
import { createCurrQuarterMessage } from "./createCurrQuarterMessage";
import { quarterRanges } from "./Quarters.js";

export function UserGetCurrQuarter() {
  const [userId, setUserId] = useState("");
  const [currQMsg, setCurrQMsg] = useState("");

  useEffect(() => {
    getUserId().then((userId) => {
      setUserId(userId);
    });
  }, []);

  const fetchCurrQMins = async () => {
    if (!userId) return;

    // Determine the current quarter
    const now = new Date();

    const currentQuarterIndex =
      quarterRanges.findIndex(([, endDate]) => now <= new Date(endDate));

    const [start, end ] = quarterRanges[currentQuarterIndex];

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
    setCurrQMsg(createCurrQuarterMessage(quarterMinutes, quarterPledge));
  };

  return { fetchCurrQMins, currQMsg };
}
