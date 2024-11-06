import * as React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export function whiteSuccessMessageFunction (message='success!') {
        return (
            <Stack sx={{ width: '100%', position: 'absolute', top: '91%', left: '50%', transform: 'translateX(-50%)', zIndex: 'tooltip' }} spacing={2}>
              <Alert severity="success" >
                {message}
              </Alert>
            </Stack>
          );    
}
