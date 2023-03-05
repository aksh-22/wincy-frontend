import Popover from "@mui/material/Popover";
import React, { memo } from "react";
import MoveToActionComponent from "../ActionButtonComponent";
import MoveToContainer from "./MoveToContainer";

function MoveToAction({ actionButton, className, moveId, milestoneId, type }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  return (
    <div>
      {actionButton ? (
        <div onClick={handleClick}>{actionButton}</div>
      ) : (
        <MoveToActionComponent
          onClick={handleClick}
          type={"move"}
          className="mr-1"
        />
      )}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: actionButton ? "bottom" : "top",
          horizontal: actionButton ? "center" : "right",
        }}
        transformOrigin={{
          vertical: actionButton ? "top" : "bottom",
          horizontal: actionButton ? "center" : "left",
        }}
        PaperProps={{
          style: {
            // background: "var(--popUpColor)",
            // background: "#646991",
            color: "#FFF",
            height: 300,
            width: 300,
            // background:"#2F3453",
            background: actionButton ? "var(--popUpColor)" : "#2F3453",
            overflow: "hidden",
          },
        }}
      >
        <MoveToContainer
          handleClose={handleClose}
          moveId={moveId}
          milestoneId={milestoneId}
        />
        {/* <AssigneeUpdateMultiple handleClose={handleClose} /> */}
      </Popover>
    </div>
    // <CommonDialog
    //   actionComponent={<MoveToActionComponent />}
    //   content={<MoveToContainer />}
    //   modalTitle="Move To"
    //   minWidth={500}
    //   maxHeight={'70vh'}
    // />
  );
}

export default memo(MoveToAction);
