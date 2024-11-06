import { useEffect, useState } from "react";
import { Alert, Stack } from "@mui/material";
import { UserGetWeekStatus } from "./utils/UserGetWeekStatus";
import { UserGetCurrQuarter } from "./utils/UserGetCurrQuarter";
import { UserGetPrevQuarter } from "./utils/UserGetPrevQuarter";
import { UserGetObligation2 } from "./utils/UserGetObligation2";
import PropTypes from "prop-types";
import * as KosherZmanim from "kosher-zmanim";
import { DateTime } from "luxon";
import { simchasTorahDate } from "./utils/Quarters";
import supabase from "./utils/supabase";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
const jewishCalendar = new KosherZmanim.JewishCalendar();
let maxIterations = 1000;

while (
  jewishCalendar.getYomTovIndex() !==
    KosherZmanim.JewishCalendar.SIMCHAS_TORAH &&
  maxIterations > 0
) {
  jewishCalendar.back();
  maxIterations--;
}
let yearStart = simchasTorahDate;
while (yearStart.weekdayLong !== "Sunday") {
  yearStart = yearStart.plus({ days: 1 });
}
const now = DateTime.now();
const quarterEndDates = [
  yearStart.plus({ weeks: 12 }),
  yearStart.plus({ weeks: 24 }),
  yearStart.plus({ weeks: 36 }),
  yearStart.plus({ weeks: 56 }),
];

const isInFirstQuarter = now >= yearStart && now <= quarterEndDates[0];

const messageStyle = {
  width: "100vmin",
  whiteSpace: "pre-line",
  fontSize: "4vmin",
};



export default function Status() {
  const [recentSessions, setRecentSessions] = useState([])
  const [formattedSessions, setFormattedSessions] = useState([]);
  const [showSessions, setShowSessions] = useState(false)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setShowButton(true)
    }, 1000)
  }, [showSessions])


  useEffect(() => {
    if (showSessions) {
        document.body.style.overflowY = "auto";
        document.body.style.overflowX = "hidden";
    } else {
      document.body.style.overflowY = "hidden";
      document.body.style.overflowX = "hidden";
    }
  }, [showSessions]);

  const { fetchWeekMins, weekMsg } = UserGetWeekStatus();
  const { fetchCurrQMins, currQMsg } = UserGetCurrQuarter();
  const { fetchPrevQMins, prevQMsg } = UserGetPrevQuarter();
  const { handleFetchData, statsMsg } = UserGetObligation2();

  const [fetched, setFetched] = useState({
    week: false,
    currQ: false,
    prevQ: false,
    owed: false,
  });



  useEffect(() => {
  async function getRecentSessions() {
    const {data, error} = await supabase.auth.getUser()
    if (error || !data) return
    const {data: sessionData, error: sessionError} = await supabase
    .from("sessions")
    .select(`created_at, session_length`)
    .order("created_at", {ascending: false} )
    .eq("user_id", data.user.id)
    .limit(15)
     if (sessionError) {
      console.log(sessionError)
      return
    }
    setRecentSessions(sessionData)
  }
  getRecentSessions()

  }, [])
  useEffect(() => {
    if (recentSessions.length) {
      const sessionValues = recentSessions
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Ensure sessions are ordered by created_at
        .map(({ created_at, session_length }) => ({
          created_at: new Date(created_at).toLocaleDateString(),
          session_length
        }));
     setFormattedSessions(sessionValues)
    } else {
      console.log('no recent sessions available');
    }
  }, [recentSessions]);


  useEffect(() => {
    if (!fetched.week) {
      fetchWeekMins();
      setFetched((prev) => ({ ...prev, week: true }));
    }
    if (!fetched.currQ) {
      fetchCurrQMins();
      setFetched((prev) => ({ ...prev, currQ: true }));
    }
    if (!isInFirstQuarter && !fetched.prevQ) {
      fetchPrevQMins();
      setFetched((prev) => ({ ...prev, prevQ: true }));
    }
    if (!fetched.owed) {
      handleFetchData();
      setFetched((prev) => ({ ...prev, owed: true }));
    }
  }, [fetched, fetchWeekMins, fetchCurrQMins, fetchPrevQMins, handleFetchData]);

  return (
    <>
      <Stack spacing={0}>
        {weekMsg && (
          <Alert variant="outlined" sx={messageStyle} severity="info">
            {weekMsg}
          </Alert>
        )}

        {currQMsg && (
          <Alert variant="outlined" sx={messageStyle} severity="info">
            {currQMsg}
          </Alert>
        )}
        {prevQMsg && (
          <Alert variant="outlined" sx={messageStyle} severity="info">
            {prevQMsg}
          </Alert>
        )}

        {statsMsg && (
          <Alert variant="outlined" sx={messageStyle} severity="info">
            {statsMsg}
          </Alert>
        )}
            {showButton && <Button variant="outlined" sx={{marginTop: "0.5%"}}
     onClick={() => {setShowSessions(true)}} >View Recent Sessions</Button>}
      </Stack>


{showSessions &&

          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Recent Sessions
              </Typography>
              <ul>
                {formattedSessions.map((session, index) => (
                  <li key={index}>
                    Date: {session.created_at}, Session Length: {session.session_length}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

}

    </>
  );
}

Status.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
