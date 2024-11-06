import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function QuarterTable({quarterData}) {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Quarter Pledge</TableCell>
            <TableCell>Quarter Minutes</TableCell>
            <TableCell>Quarter Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {quarterData.map((quarter, index) => (
            <TableRow key={index}>
              <TableCell>{quarter.pledge}</TableCell>
              <TableCell>{quarter.total_minutes}</TableCell>
              <TableCell>{quarter.quarterStatus}</TableCell>
             </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}