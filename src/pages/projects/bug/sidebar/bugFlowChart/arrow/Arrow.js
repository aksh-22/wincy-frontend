import React from "react";
import "./Arrow.css";
function Arrow({
  horizontal,
  arrowDirection,
  width,
  arrowColor,
  lineColor,
  height,
  marginBottom,
  pointerDisable,
  style
}) {
  return horizontal ? (
    <div
      className="horizontal_arrow"
      style={{
        width: width,
        flexDirection: arrowDirection === "left" ? "row-reverse" : "",
        ...style
      }}
    >
      <div
        className="horizontal_line"
        style={{
          backgroundColor: lineColor ?? arrowColor,
        }}
      />
     {pointerDisable ?? <div
        className={
          arrowDirection === "left"
            ? "horizontal_point_left"
            : "horizontal_point_right"
        }
        style={{
          borderLeftColor: arrowDirection === "left" ? "" : arrowColor,
          borderRightColor: arrowDirection === "left" ? arrowColor : "",
        }}
      />}
    </div>
  ) : (
    <div
      className="arrow"
      style={{
        width: width,
        height: height,
        flexDirection: arrowDirection === "top" ? "column-reverse" : "",
        ...style
      }}
    >
      <div
        className="line"
        style={{
          backgroundColor: lineColor ?? arrowColor,
        }}
      />
     {pointerDisable?? <div
        className={arrowDirection === "top" ? "point_top" : "point_bottom"}
        style={{
          borderTopColor: arrowDirection === "top" ? "" : arrowColor,
          borderBottomColor: arrowDirection === "top" ? arrowColor : "",
          marginBottom: arrowDirection === "top"  ? "" : marginBottom ?? 10,
          marginTop: arrowDirection === "top" ? 10 : 0
        }}
      />}
    </div>
  );
}

export default Arrow;
