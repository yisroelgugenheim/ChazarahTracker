import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
export default function Autocompleter({ users, setSelectedUserId }) {

  function handleChange(event, value) {
    setSelectedUserId(value ? value.user_id : '')
  }

  return (
    <>
      <Autocomplete
        disablePortal
        id="user-select"
        options={users}
        getOptionLabel={(option) => option.name} // Display name in the autocomplete options
        sx={{ width: 300, marginBottom: 2, marginTop: 1 }}
        renderInput={(params) => <TextField {...params} label="Select User" />}
        onChange={handleChange}
      />
    </>)
}
