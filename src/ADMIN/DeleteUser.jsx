import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios"; // Import axios if not already imported

export default function DeleteUser({ selectedUserId }) {
  const [confirmDelete, setConfirmDelete] = useState(false); // State to manage delete confirmation dialog

  // Define the deleteUser function
  const deleteUser = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/delete-user/${selectedUserId}`
      );
      console.log(response.data);
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("There was an error deleting the user");
    } finally {
      setConfirmDelete(false); // Reset the confirmation state after the delete operation
    }
  };

  // Handle the button click to show the confirmation dialog
  const handleDeleteClick = () => {
    if (!selectedUserId) {
      alert("No user selected.");
      return;
    }
    setConfirmDelete(true); // Show confirmation dialog
  };

  // Handle the confirmation dialog actions
  const handleConfirmDelete = () => {
    deleteUser(); // Call deleteUser if confirmed
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false); // Close dialog without deleting
  };

  return (
    <div>
      <Button
        variant="contained"
        color="warning"
        disabled={!selectedUserId}
        onClick={handleDeleteClick}
      >
        Delete User
      </Button>

      {/* Confirmation dialog */}
      <Dialog open={confirmDelete} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
