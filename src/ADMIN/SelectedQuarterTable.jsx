import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const QuarterTable = ({ quarterData }) => (
  <TableContainer component={Paper} sx={{ mt: 2 }}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Total Minutes</TableCell>
          <TableCell>Pledge</TableCell>
          <TableCell>Quarter Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {quarterData.map((row, index) => (
          <TableRow key={index}>
            <TableCell>{row.total_minutes}</TableCell>
            <TableCell>{row.pledge}</TableCell>
            <TableCell>{row.quarterStatus}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default QuarterTable;
