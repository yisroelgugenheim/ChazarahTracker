import { useEffect, useState } from "react";
import * as KosherZmanim from "kosher-zmanim";
import supabase from "./supabase";
import { getUserId } from "./getUserId";
import { getPledge } from "./getPledge";
import { createWeekMessage } from "./createWeekMessage";

// Initialize the Jewish calendar to calculate dates
const jewishCalendar = new KosherZmanim.JewishCalendar();
while (
  jewishCalendar.getYomTovIndex() !== KosherZmanim.JewishCalendar.SIMCHAS_TORAH
) {
  jewishCalendar.back();
}
const simchasTorahDate = jewishCalendar.getDate();
let yearStart = simchasTorahDate;
while (yearStart.weekdayLong !== "Sunday") {
  yearStart = yearStart.plus({ days: 1 });
}

// Calculate the start and end dates for each week
const weekDates = [];
for (let i = 0; i < 52; i++) {
  const start = yearStart.plus({ weeks: i });
  const end = start.plus({ days: 6 });
  weekDates.push({
    start: start.toLocaleString(), // Format the start date
    end: end.toLocaleString(), // Format the end date
  });
}

export function UserGetWeekStatus() {
  const [userId, setUserId] = useState("");
  const [weekMsg, setWeekMsg] = useState("");

  useEffect(() => {
    // Fetch the user ID once when the component mounts
    const fetchUserId = async () => {
      const userId = await getUserId();
      setUserId(userId);
    };
    fetchUserId();
  }, []); // Empty dependency array means this runs once on mount

  const fetchWeekMins = async () => {
    if (!userId) return;

    // Determine the current week
    const now = new Date();
    let currentWeekIndex = 0;

    for (let i = 0; i < weekDates.length; i++) {
      const weekEndDate = new Date(weekDates[i].end);
      if (now <= weekEndDate) {
        currentWeekIndex = i;
        break;
      }
    }

    const { start, end } = weekDates[currentWeekIndex];

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

    // Sum the session lengths
    let weekMinutes = 0;
    for (let session of data) {
      weekMinutes += session.session_length;
    }

    const result = await getPledge(userId);

    const pledge = result[0].pledged_minutes;

    // Calculate the fraction of the weekly pledge based on the current day
    const currentDayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const fractionOfPledge = Math.round(((currentDayOfWeek + 1) / 7) * pledge);
    setWeekMsg(createWeekMessage(weekMinutes, fractionOfPledge));
    console.log(fractionOfPledge);

    if (!result || result.length === 0) {
      console.log("No pledge data found.");
      return;
    }
  };

  return { fetchWeekMins, weekMsg };
}
