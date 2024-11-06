import * as React from "react";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export function darkFailMessageFunction(error = "failed!") {
  return (
    <Stack
      sx={{
        width: "100%",
        position: "absolute",
        top: "91%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "tooltip",
      }}
      spacing={2}
    >
      <Alert
        severity="error"
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.0)",
          color: "white",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
          borderRadius: 2,
        }}
      >
        {error}
      </Alert>
    </Stack>
  );
}
