import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function WeeksTable({ sessions }) {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Week Start</TableCell>
            <TableCell>Pledge</TableCell>
            <TableCell>Minutes</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sessions.map((week, index) => (
            <TableRow key={index}>
              <TableCell>{week.week_start}</TableCell>
              <TableCell>{week.pledge}</TableCell>
              <TableCell>{week.total_minutes}</TableCell>
              <TableCell>{week.weekStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

// import * as React from 'react';
// import { useState } from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';

// export default function WeeksTable({sessions}) {

//   return ( <>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="simple table">
//           <TableHead>
//             <TableRow>
//               <TableCell align="right">Week Start</TableCell>
//               <TableCell align="right">Pledged Minutes</TableCell>
//               <TableCell align="right">Total Minutes</TableCell>
//               <TableCell align="right">Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody/>

//          <TableBody>
//           {sessions.map((week) => (  // access sessions
//             <TableRow style={{cursor:'pointer'}}
//               key={week.week_start}>
//               <TableCell align="right">{week.week_start}</TableCell>
//               <TableCell align="right">{week.pledged_minutes}</TableCell>
//               <TableCell align="right">{week.total_minutes}</TableCell>
//               <TableCell align="right">{week.status}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//         </Table>
//       </TableContainer>
//      </>
//   );
// }
