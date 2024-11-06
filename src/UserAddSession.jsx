import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import supabase from './utils/supabase';
import dayjs from 'dayjs';
import { getUserId } from './utils/getUserId';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { darkSuccessMessageFunction } from './utils/darkSuccessMessageFunction';
import { darkFailMessageFunction } from './utils/darkFailMessageFunction';
import toggleWithDelay from "./utils/toggleWithDelay.js";

function UserAddSession() {

  const [sessionLength, setSessionLength] = useState('');
  const [time, setTime] = useState(dayjs());
  const [userId, setUserId] = useState('')
  const [error, setError] = useState('')
  const [succMsg, setSuccMsg] = useState('')

  const handleChange = (newVal) => {
    setTime(newVal); // Call the prop function with new value
    console.log(time)
    console.log(newVal)
  };


  useEffect(() => {
    getUserId()
      .then(userId => {
        setUserId(userId)
      })

  }, [time])


  const submitSession = async (e) => {
    e.preventDefault()
    if (!time || !sessionLength || !userId) return
    const { data, error } = await supabase
      .from('sessions')
      .insert({ user_id: userId, session_length: sessionLength, created_at: time.toISOString() })
      .select()
    if (error) {
      console.log(error)
      toggleWithDelay(setError, error.message, '', 2000)
    }
    else {
      console.log(data)
      toggleWithDelay(setSuccMsg, 'success!', '', 2000)
    }
  };

  return (<>
    <Box
      sx={{ mb: 5 }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} >
        <DateTimePicker className='add-session'
          label="Select DateTime"
          value={time}
          onChange={handleChange}
          slotProps={{
            textField: { variant: 'outlined' }
          }}
          sx={{
            margin: "15px",
            marginLeft: "1px",
            width: '300px',
            marginTop: '0px',
            bottom: -100,
            left: 100
          }}
        />
      </LocalizationProvider>
      <TextField className='add-session'
        sx={{
          margin: "15px",
          marginLeft: "1px",
          width: '300px',
          marginTop: '0px',
          bottom: -100,
          left: 100
        }}
        label="Session Length (minutes)"
        type="number"
        value={sessionLength}
        onChange={(e) => setSessionLength(e.target.value)}
        fullWidth
      />

      <Button
        sx={{ mt: 0.2, height: 53, left: 90, bottom: -100 }}
        variant="contained" color="primary"
        disabled={!userId || !sessionLength || !time}
        onClick={submitSession}
      >
        Confirm Session
      </Button>

      {error && darkFailMessageFunction(error)}
      {succMsg && darkSuccessMessageFunction(succMsg)}
    </Box>
  </>);
}

export default UserAddSession;
