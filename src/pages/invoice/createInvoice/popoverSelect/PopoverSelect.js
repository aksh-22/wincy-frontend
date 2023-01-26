import React from "react";
import Popover from "@mui/material/Popover";
import "./PopoverSelect.scss";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
function PopoverSelect({
  placeholder,
  className,
  popUpComponent,
  value,
  error,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "select-popover" : undefined;
  return (
    <div className={`popoverSelect ${className}`}>
      <div onClick={handleClick} className="popoverSelect_action">
        <div className="flex">
          {" "}
          {value ? (
            <p>{value}</p>
          ) : (
            <p className="popoverSelect_placeholder">{placeholder}</p>
          )}
        </div>
        <KeyboardArrowDownRoundedIcon
          style={{
            transform: anchorEl !== null ? "rotate(180deg)" : "rotate(0deg)",
            transition: "ease-in-out 0.2s",
          }}
        />
      </div>
      {error && (
        <p
          style={{
            color: "var(--red)",
            fontSize: 12,
          }}
        >
          {error}
        </p>
      )}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        className=""
        PaperProps={{
          className: "popoverSelect_popup",
        }}
      >
        {popUpComponent &&
          React.cloneElement(popUpComponent, {
            onClose: handleClose,
          })}
      </Popover>
    </div>
  );
}

export default PopoverSelect;
