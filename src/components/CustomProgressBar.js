import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";

import LinearProgress from "@material-ui/core/LinearProgress";

const BorderLinearProgress = withStyles((theme) => ({
  root: {},
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
    height: 8,
  },
}))(LinearProgress);

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

export default function CustomProgressBar({ value , labelPositionRight }) {
  const classes = useStyles();

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
   {!labelPositionRight &&   <p style={{ marginRight: 5, color: "#ee7700" }}>
        {value ? Math.round(value) : "0"}%
      </p>}
      <div className={classes.root}>
        <BorderLinearProgress variant="determinate" value={value ?? 0} />
      </div>
      {labelPositionRight &&   <p style={{ marginLeft: 5, color: "#ee7700" }}>
        {value ? Math.round(value) : "0"}%
      </p>}
    </div>
  );
}
