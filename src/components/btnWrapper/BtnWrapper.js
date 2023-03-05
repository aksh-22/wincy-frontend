import React from "react";
import classes from "./BtnWrapper.module.css";

export default function BtnWrapper({ style, children, className }) {
  return (
    <div
      className={`${classes.wrapper} ${className}`}
      style={{
        ...style,
        backgroundColor:
          children?.length > 2 ? "var(--projectCardBg)" : "transparent",
        border: children?.length <= 2 && "1px solid var(--progressBarColor)",
        padding: children?.length <= 2 ? 0 : 10,
      }}
    >
      {children}
    </div>
  );
}
