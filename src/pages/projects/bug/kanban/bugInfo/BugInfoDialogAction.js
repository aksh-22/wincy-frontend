import React from "react";
import Dialog from "@mui/material/Dialog";
import BugInfoPopup from "./BugInfoPopup";

function BugInfoDialogAction({ open, handleClose  , data}) {
  return (
    <Dialog
      classes={{ paper: "kanbanpopup" }}
      onClose={handleClose}
      open={open}
    >
        <BugInfoPopup 
        propData={data}
        handleClose={handleClose}
        />
    </Dialog>
  );
}

export default BugInfoDialogAction;
