import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

export default function InfoMessage({ minsMsg, tempMsg, statsMsg, infoMsg }) {
  if (minsMsg || tempMsg || statsMsg) {
    return (
      <Stack
        sx={{
          width: "100%",
          position: "fixed", // Changed from 'absolute' to 'fixed' to position relative to viewport
          bottom: "0%", // Adjusted positioning to bottom
          left: "50%", // Center horizontally
          transform: "translateX(-50%)", // Keep the transform to center the alert
          zIndex: "tooltip",
        }}
        spacing={2}
      >
        <Alert
          severity="info"
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
            borderRadius: 2,
          }}
        >
          {infoMsg ? infoMsg : ""}
          {minsMsg ? minsMsg : ""}
          {tempMsg ? tempMsg : ""}
          {statsMsg ? statsMsg : ""}
        </Alert>
      </Stack>
    );
  }
}
