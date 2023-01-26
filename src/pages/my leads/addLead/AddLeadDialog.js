import React from "react";
import Dialog from "@mui/material/Dialog";
import AddLead from "./AddLead";
import "./AddLead.scss"
function AddLeadDialog({ open, handleClose }) {
  return (
    <>
      <Dialog
        classes={{ paper: "addleadpopup" }}
        onClose={() =>{}}
        open={open}
      >
        <AddLead handleClose={handleClose} />
      </Dialog>
    </>
  );
}

export default AddLeadDialog;
