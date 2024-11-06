import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useState } from "react";

export default function InstructionsMessage() {
  const [message, setMessage] = useState(
    <p style={{ fontSize: "2.5vmin" }}>
      1. <strong>Tap</strong> or <strong>Enter</strong> to{" "}
      <strong>start</strong> or
      <strong> pause</strong>.
    </p>
  );

  setTimeout(() => {
    setMessage("");
  }, 2000);

  return (
    <Stack
      sx={{
        width: "100%",
        position: "fixed",
        bottom: "0%",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: "tooltip",
      }}
      spacing={2}
    >
      {message && (
        <Alert
          severity="info"
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            color: "white",
            // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
            borderRadius: 2,
            padding: "0",
          }}
        >
          {message}
        </Alert>
      )}
    </Stack>
  );
}
