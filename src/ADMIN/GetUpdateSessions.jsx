import { useState } from "react";
import BasicTable from "./BasicTable";
import UpdateSesLength from "./UpdateSesLength";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import supabase from "../utils/supabase";
import { whiteFailMessageFunction } from "../utils/whiteFailMessageFunction";
import toggleWithDelay from "../utils/toggleWithDelay.js";

export default function GetUpdateSessions({
  selectedUserId,
  selectedSessionId,
  setSelectedSessionId,
}) {
  const [sessions, setSessions] = useState([]);
  const [isUpdated, setIsUpdated] = useState(false);
  const [sessionLength, setSessionLength] = useState("");
  const [error, setError] = useState("");

  // Function to fetch sessions from Supabase
  const fetchSessions = async () => {
    if (selectedUserId !== "") {
      try {
        const { data, error } = await supabase
          .from("sessions")
          .select()
          .eq("user_id", selectedUserId);

        if (error) {
          toggleWithDelay(setError, error.message, "", 2000);
          return;
        }

        if (data.length < 1) {
          toggleWithDelay(setError, "no sessions found", "", 3000);
        }

        let sessionsArray = [];
        if (!data || !data.length) return;

        data.forEach((item) => {
          sessionsArray.push(item);
        });
        setSessions(sessionsArray);
      } catch (error) {
        setError(error.message || "Error. Please try again later.");
      }
    }
  };

  return (
    <>
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
          onClick={() => fetchSessions()}
        >
          Get Sessions
        </Button>
      </Box>
      {sessions.length > 0 && (
        <UpdateSesLength
          selectedUserId={selectedUserId}
          sessionLength={sessionLength}
          setSessionLength={setSessionLength}
          selectedSessionId={selectedSessionId}
          setIsUpdated={setIsUpdated}
        />
      )}
      {sessions.length > 0 && (
        <BasicTable
          sessions={sessions}
          isUpdated={isUpdated}
          sessionLength={sessionLength}
          selectedSessionId={selectedSessionId}
          setSelectedSessionId={setSelectedSessionId}
        />
      )}
      {error && whiteFailMessageFunction(error)}
    </>
  );
}
