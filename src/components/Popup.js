import { ClickAwayListener } from "@material-ui/core";
import React from "react";
import { useState } from "react";

export default function Popup({
  children,
  data,
  display,
  width,
  height,
  background,
  content,
}) {
  const [showPopup, setShowPopup] = useState(false);

  const [coordX, setCoordX] = useState(0);
  const [coordY, setCoordY] = useState(0);

  return (
    <ClickAwayListener
      onClickAway={() => {
        setShowPopup(false);
      }}
    >
      <div
        onClick={(e) => {
          setCoordY(e.pageY);
          setCoordX(e.pageX);
          setShowPopup(true);
        }}
      >
        {children}
        <div
          style={{
            position: "absolute",
            display: showPopup ? display ?? "block" : "none",
            width: width ?? "auto",
            height: height ?? "auto",
            top: coordY,
            left: coordX,
            background: background ?? "var(--primary)",
            padding: 10,
          }}
        >
          {content}
        </div>
      </div>
    </ClickAwayListener>
  );
}
