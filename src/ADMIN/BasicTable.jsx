import * as React from "react";
import { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function BasicTable({
  sessions,
  selectedSessionId,
  setSelectedSessionId,
  isUpdated,
  sessionLength,
}) {
  const [sessToUpdate, setSessToUpdate] = useState("");

  const handleClick = (event, id) => {
    if (selectedSessionId === id) {
      setSelectedSessionId(null); // Deselect if the same row is clicked again
    } else {
      setSelectedSessionId(id); // Set the selected state to the clicked row's id
    }
  };
  useEffect(() => {
    if (selectedSessionId) {
      for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].session_id === selectedSessionId) {
          setSessToUpdate(sessions[i]);
        }
      }
    }
  }, [sessions, selectedSessionId]);

  console.log(sessToUpdate);
  function formatDate(dateString) {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right">Session ID</TableCell>
              {/* <TableCell align="right">User ID</TableCell> */}
              <TableCell align="right">Session Length</TableCell>
              <TableCell align="right">Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody />

          <TableBody>
            {sessions.map(
              (
                session // access sessions
              ) => (
                <TableRow
                  style={{ cursor: "pointer" }}
                  key={session.session_id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    backgroundColor:
                      selectedSessionId === session.session_id
                        ? "#f4f4f4"
                        : "transparent",
                  }} // Highlight selected row
                  onClick={(event) => handleClick(event, session.session_id)}
                  hover
                >
                  <TableCell align="right">{session.session_id}</TableCell>
                  {/* <TableCell align="right">{session.user_id}</TableCell> */}
                  <TableCell align="right">{session.session_length}</TableCell>
                  <TableCell align="right">
                    {formatDate(session.created_at)}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        {isUpdated ? (sessToUpdate.session_length = sessionLength) : ""}
      </TableContainer>
    </>
  );
}
