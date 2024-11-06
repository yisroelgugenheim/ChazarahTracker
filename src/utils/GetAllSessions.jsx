import { useEffect, useState } from "react";
import supabase from "./supabase";
import { saveAs } from "file-saver";
import Papa from "papaparse";

export default function GetAllSessions() {
  const [sessionsByUser, setSessionsByUser] = useState({});
  useEffect(() => {
    async function getUsersSessions() {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select()
        .neq("email", "office@ateresami.org")
        .neq("email", "naftoligug@gmail.com")
        .neq("email", "yisgug@gmail.com");
      if (userError) {
        console.log(userError);
        return;
      }
      const sessionsByUser = {};
      await Promise.all(
        userData.map(async (user) => {
          const { first_name, last_name, user_id } = user;
          const { data: sessionData, error: sessionError } = await supabase
            .from("sessions")
            .select(`created_at, session_length, user_id`)
            .eq("user_id", user_id);
          if (sessionError) {
            console.log(sessionError);
          }
          sessionsByUser[user_id] = {
            user: `${first_name} ${last_name}`,
            sessions: sessionData,
          };
        })
      );
      setSessionsByUser(sessionsByUser);
    }
    getUsersSessions();
  }, []);

  const downloadCSV = () => {
    const csvData = [];
    Object.keys(sessionsByUser).forEach((userId) => {
      sessionsByUser[userId].sessions.forEach((session) => {
        csvData.push({
          user: sessionsByUser[userId].user,
          created_at: new Date(session.created_at).toLocaleString(),
          session_length: session.session_length,
        });
      });
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const currentDate = new Date().toISOString().split("T")[0]; // Format: YYYY-MM-DD
    const filename = `sessions_${currentDate}.csv`;
    saveAs(blob, filename);
  };

  return (
    <div>
      <button style={{ cursor: "pointer" }} onClick={downloadCSV}>
        Download csv
      </button>
      {Object.keys(sessionsByUser).map((userId) => (
        <div key={userId}>
          <h3>{sessionsByUser[userId].user}</h3>
          <ul>
            {sessionsByUser[userId].sessions.map((session, index) => (
              <li key={index}>
                Created At: {new Date(session.created_at).toLocaleString()},
                Session Length: {session.session_length}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
