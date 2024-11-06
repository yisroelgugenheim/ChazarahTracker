import * as React from 'react';
import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export function darkSuccessMessageFunction (message='success!') {
  return (
      <Stack sx={{ width: '100%', position: 'absolute', top: '91%', left: '50%', transform: 'translateX(-50%)', zIndex: 'tooltip' }} spacing={2}>
      <Alert severity="success" sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
        borderRadius: 2, // Adjust the border-radius if needed
        // Additional styles can be added here
      }}>
        {message}
      </Alert>
    </Stack>
    ) 
}