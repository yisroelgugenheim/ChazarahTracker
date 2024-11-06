import Alert from "@mui/material/Alert";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import supabase from "./utils/supabase.js";

export default function StopwatchAlerts({ userId, duration, showSuccMsg, error }) {

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [pledge, setPledge] = useState(0); // State to store the user's pledge

  useEffect(() => {
    async function fetchUserPledge() {
      const { data, error } = await supabase
        .from("users")
        .select("pledged_minutes")
        .eq("user_id", userId); // Use userId from props
      if (error) {
        console.log(error);
        return;
      }
      if (data && data.length > 0) {
        setPledge(data[0].pledged_minutes); // Set the user's pledge
      }
    }

    fetchUserPledge();
  }, [userId]);


  let remainingMinutes = null; // State to track remaining minutes owed
  if (showSuccMsg) {
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
    const fractionOfPledge = Math.round(((currentDayOfWeek + 1) / 7) * pledge);
    remainingMinutes = Math.round(fractionOfPledge - duration);
  }

  return (
    <>
      {showSuccMsg && (
        <Alert
          sx={{
            width: "100%",
            position: "absolute",
            top: isSmallScreen ? "71%" : "91%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "tooltip",
          }}
        >
          Success! You now owe {remainingMinutes} minutes.
        </Alert>
      )}
      {error && (
        <Alert
          severity="error"
          sx={{
            width: "100%",
            position: "absolute",
            top: isSmallScreen ? "71%" : "91%",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "tooltip",
          }}
        >
          {error}
        </Alert>
      )}
    </>
  );
}

StopwatchAlerts.propTypes = {
  duration: PropTypes.number.isRequired,
  userId: PropTypes.string.isRequired,
  showSuccMsg: PropTypes.bool.isRequired,
  error: PropTypes.string,
};
