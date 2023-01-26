import React, { memo } from "react";
import classes from "./CustomProgressBar.module.css";
function CustomProgressBar({ value , steps , stepCount=20 , labelPositionRight  ,className , colorCode , height}) {
  return (
 
<div className={` ${classes.projectBox__progress} ${className}`}>
{/* <p>{info?.milestoneCount ? info?.milestoneCount : 0}%</p> */}
{!labelPositionRight && <h4>{value ? Math.round(value) : "0"}%</h4>}
<div
  className={`__customProgressBar ${classes.projectBox__progress__progressBar}`}
  style={{
    background: `linear-gradient(to right,  ${value === 100 ? "var(--green)" : colorCode??"var(--primary)"} ${
      value ? Math.round(value) : "0"
    }%,var(--progressBarBgColor) 0%)`,
    height:height
  }}
  // style={{
  //   background : "var(--progressBarBgColor)"
  // }}
></div>
{labelPositionRight && <h4>{value ? Math.round(value) : "0"}%</h4>}
</div>  

  );
}

export default memo(CustomProgressBar)