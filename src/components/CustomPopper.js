import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";

import Fade from "@material-ui/core/Fade";
import Paper from "@material-ui/core/Paper";
import { ClickAwayListener, IconButton } from "@material-ui/core";

export default function CustomPopper({
  content,
  value,
  valueStyle,
  width,
  padding,
  paperClassName,
  innerPopper,
  noHover,
  disabled,
  zIndex,
  maxWidth,
  buttonClassName,
  containerClassName,
  labelClassName,
  disableRipple,
  widthAuto
}) {
  const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: width ?? 1000,
    },
  }));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState();
  const classes = useStyles();
  const handleClick = (newPlacement) => (event) => {
    event.preventDefault();
    event.stopPropagation()
    setAnchorEl(event.currentTarget);
    setOpen((prev) => placement !== newPlacement || !prev);
    setPlacement(newPlacement);
  };
  return (
    <div
      style={{ margin: "0" }}
      className={containerClassName}
      //  onMouseLeave={() => !noHover && setOpen(false)}
    >
      <Popper
        disableEnforceFocus
        open={open}
        anchorEl={anchorEl}
        placement={placement}
        className={paperClassName}
        transition
        style={{
          zIndex: zIndex ?? 9999,
          borderRadius: 4,
          overflow: "hidden",
          maxWidth: maxWidth,
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener
            onClickAway={() => {
              setOpen(false);
            }}
          >
            <Fade {...TransitionProps} timeout={350}>
              <Paper className={innerPopper}>
                {content && React.cloneElement(content, {
                  handleClose: setOpen,
                })}
              </Paper>
            </Fade>
          </ClickAwayListener>
        )}
      </Popper>
      <IconButton
        // onMouseEnter={!noHover && handleClick('bottom')}
        className={`p-0  ${buttonClassName} ${widthAuto ? "widthAuto" : ""} `}
        
        classes={{
          label:labelClassName
        }}
        // disabled={disabled ?? false}
        onClick={!disabled ? handleClick("bottom") : () => {}}
        // disabled={disabled}
        // style={valueStyle}
    disableRipple={disableRipple}
    disableFocusRipple={disableRipple}
    disableTouchRipple={disableRipple}


        style={disabled ? { cursor: "default" ,...valueStyle } : { cursor: "pointer",...valueStyle }}
      >
        {value}
      </IconButton>
    </div>
  );
}
