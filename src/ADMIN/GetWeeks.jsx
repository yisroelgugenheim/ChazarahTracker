import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import WeeksTable from "./WeeksTable";
import supabase from "../utils/supabase";
import { getWeekStart } from "../utils/getWeekStart";
import { getPledge } from "../utils/getPledge";
import { whiteFailMessageFunction } from "../utils/whiteFailMessageFunction";
import toggleWithDelay from "../utils/toggleWithDelay.js";

export default function GetWeeks({ selectedUserId }) {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState("");
  const [pledge, setPledge] = useState(0);

  useEffect(() => {
    if (!selectedUserId) return;
    getPledge(selectedUserId)
      .then((result) => {
        setPledge(result[0].pledged_minutes);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [selectedUserId]);

  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  const fetchWeeks = async () => {
    if (selectedUserId === "") return;

    try {
      const { data, error } = await supabase
        .from("sessions")
        .select()
        .eq("user_id", selectedUserId)
        .order("created_at", { ascending: true }); // Ensure the data is sorted by created_at

      if (error) {
        setError(error.message);
        return;
      }

      if (!data || data.length < 1) {
        toggleWithDelay(setError, "no sessions found", "", 3000);
        setSessions([]);
        return;
      }

      // Process data to create sessions array
      const sessionsArray = data.map((item) => {
        const weekStart = getWeekStart(item.created_at);
        const formattedWeekStart = formatDate(weekStart);
        return {
          week_start: formattedWeekStart,
          user_id: item.user_id,
          created_at: item.created_at,
          session_length: item.session_length,
        };
      });

      // Calculate session lengths by week
      const sessionByWeek = sessionsArray.reduce((acc, session) => {
        if (!acc[session.week_start]) {
          acc[session.week_start] = 0;
        }
        acc[session.week_start] += session.session_length;
        return acc;
      }, {});

      // Format filtered sessions
      const filteredSessions = [];
      for (const [week_start, total_minutes] of Object.entries(sessionByWeek)) {
        const weekStatus =
          pledge > total_minutes
            ? `-${pledge - total_minutes}`
            : `+${total_minutes - pledge}`;
        filteredSessions.push({
          week_start,
          total_minutes,
          pledge,
          weekStatus,
        });
      }

      setSessions(filteredSessions);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  return (
    <>
      {error && whiteFailMessageFunction(error)}
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button
          disabled={!selectedUserId}
          variant="contained"
          onClick={() => fetchWeeks()}
        >
          Get Weeks
        </Button>
      </Box>
      {sessions.length > 0 ? <WeeksTable sessions={sessions} /> : ""}
    </>
  );
}
