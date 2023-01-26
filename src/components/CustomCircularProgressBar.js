import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
// import { LightTooltip } from './tooltip/LightTooltip';
function CustomCircularProgressBar({
  percentage,
  strokeWidth,
  percentageDisable,
}) {
  return (
    <CircularProgressbar
      value={percentage ?? 0}
      text={percentageDisable ?? percentage ?? "%"}
      strokeWidth={strokeWidth}
      styles={buildStyles({
        textColor: "#FFF",
        pathColor: "var(--primary)",
        trailColor: "var(--divider)",
        textSize: 30,
        strokeLinecap: "butt",
      })}
    />
  );
}

export default CustomCircularProgressBar;
