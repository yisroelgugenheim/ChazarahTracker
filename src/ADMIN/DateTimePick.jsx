import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

export default function DateTimePickerValue({ time, setTime }) {

  const handleChange = (newVal) => {
    setTime(newVal); // Call the prop function with new value
    console.log(time)
    console.log(newVal)
  };


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateTimePicker
        sx={{ width: 300, left: 200 }}
        label="Select DateTime"
        value={time}
        onChange={handleChange}
        slotProps={{
          textField: { variant: 'outlined' }
        }}
      />
    </LocalizationProvider>
  );
}
