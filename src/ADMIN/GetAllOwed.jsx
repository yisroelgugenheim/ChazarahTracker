import { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import supabase from "../utils/supabase";
import { downloadReport, generateUserObligationReport } from "./Report";
import { whiteFailMessageFunction } from "../utils/whiteFailMessageFunction";
import Typography from "@mui/material/Typography";
import {
  partitionUserQuarters,
  quarterRangeStrings,
} from "../utils/Quarters.js";

export default function GetAllOwed() {
  const [usersDataState, setUsersDataState] = useState([]);
  const [error, setError] = useState("");

  const handleFetchData = async () => {
    const { data: usersData, error: usersError } = await supabase
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
      .neq("email", "office@ateresami.org")
      .neq("email", "yisgug@gmail.com")
      .neq("email", "naftoligug@gmail.com");

    if (usersError) {
      setError(usersError.message);
      return;
    }

    setUsersDataState(usersData.map((d) => partitionUserQuarters(d)));
  };
  const handleDownloadReport = () => {
    const reportContent = generateUserObligationReport(userData); // Ensure this function is defined
    downloadReport(reportContent, "user_obligation_report.txt"); // Ensure this function is defined
  };

  const userData = usersDataState;

  return (
    <>
      {error && whiteFailMessageFunction(error)}
      <Button
        variant="contained"
        disabled={usersDataState.length < 1}
        onClick={handleDownloadReport}
      >
        Download Report
      </Button>
      <Box
        component="form"
        sx={{
          "& .MuiTextField-root": { m: 1 },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Button variant="contained" onClick={handleFetchData} sx={{ mt: 2 }}>
          Get Status
        </Button>

        {userData.length > 0 && (
          <Paper>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell colSpan={2} />
                    <TableCell colSpan={4}>Obligation</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ verticalAlign: "top" }}>Name</TableCell>
                    <TableCell style={{ verticalAlign: "top" }}>
                      Email
                    </TableCell>
                    {quarterRangeStrings.map((rangeString, index) => (
                      <TableCell key={index} style={{ verticalAlign: "top" }}>
                        <Typography variant="body1">Q{index + 1}</Typography>
                        <Typography variant="body2" fontSize={12}>
                          {rangeString}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userData.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>${user.quarters[0]}</TableCell>
                      <TableCell>${user.quarters[1]}</TableCell>
                      <TableCell>${user.quarters[2]}</TableCell>
                      <TableCell>${user.quarters[3]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </>
  );
}
