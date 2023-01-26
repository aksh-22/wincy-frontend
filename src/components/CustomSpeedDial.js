import React from "react";
import { makeStyles } from "@material-ui/core/styles";

import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import FileCopyIcon from "@material-ui/icons/FileCopyOutlined";
import SaveIcon from "@material-ui/icons/Save";
import PrintIcon from "@material-ui/icons/Print";
import ShareIcon from "@material-ui/icons/Share";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MoreVertIcon from "@material-ui/icons/MoreVert";
const useStyles = makeStyles((theme) => ({
  root: {
    transform: "translateZ(0px)",
    zIndex: 999,
    // flexGrow: 1,
  },
  exampleWrapper: {
    position: "relative",
    // marginTop: theme.spacing(3),
    height: 20,
  },
  radioGroup: {
    margin: theme.spacing(1, 0),
  },
  speedDial: {
    // position: 'absolute',
    "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
  fab: {
    backgroundColor: theme.palette.primary,
  },
  tooltip: {
    backgroundColor: "white",
    color: "black",
    // fontFamily: "roboto",
  },
}));

export default function CustomSpeedDial({
  speedDialIcon,
  actionArray,
  open,
  handleOpen,
  handleClose,
  marginTop,
}) {
  const useStyles = makeStyles((theme) => ({
    root: {
      transform: "translateZ(0px)",
      zIndex : 999999999999
      // marginTop: marginTop ?? -10,
    },
    exampleWrapper: {
      position: "relative",
      // marginTop: theme.spacing(3),
      height: 40,
    },
    radioGroup: {
      margin: theme.spacing(1, 0),
    },
    speedDial: {
      // position: 'absolute',
      "&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft": {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
      },
      "&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight": {
        top: theme.spacing(2),
        left: theme.spacing(2),
      },
      

    },
    fab: {
      backgroundColor: "var(--lightBlue)"
    },
    tooltip: {
      backgroundColor: "white",
      color: "black",
      // fontFamily: 'roboto',
    },

  }));
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.exampleWrapper}>
        <SpeedDial
          ariaLabel="SpeedDial example"
          className={classes.speedDial}
          icon={speedDialIcon}
          onClose={handleClose}
          onOpen={handleOpen}
          open={open}
          direction={"down"}
          FabProps={{ size: "small", style: { color: "var(--defaultWhite" , backgroundColor: "var(--progressBarColor)", } , className:"no213" }}
        >
          {actionArray?.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleClose(action)}
              TooltipClasses={{
                tooltip: classes.tooltip,
              }}
              className={`${classes.fab} fabSpeedDialAction`}
              //   style={{ background: 'green', backgroundColor: 'green' }}
            />
          ))}
        </SpeedDial>
      </div>
    </div>
  );
}
