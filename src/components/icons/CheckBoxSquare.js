import React, { useState } from "react";
import { ReactComponent as Icon } from "assets/svg/checkBoxSquare.svg";
// import { ReactComponent as Rectangle } from "assets/svg/rectangle.svg";

export default function CheckBoxSquare({
  className,
  color,
  height,
  width,
  onClick,
  hoverColor,
  style,
  type,
  isChecked,
  disabled,
  containerStyle,
}) {
  const [hover, setHover] = useState(false);
  const toggleHover = () => {
    setHover(!hover);
  };
  var linkStyle;
  if (hover) {
    linkStyle = { fill: hoverColor ?? "var(--defaultWhite)" };
  } else {
    linkStyle = { fill: color ?? "var(--defaultWhite)" };
  }
  return (
    <div className={className}>
      {!isChecked ? (
        <div
          style={{
            height: 19,
            width: 19,
            border: disabled ? "1px solid var(--divider)" : "1px solid #8A9AFF",
            borderRadius: 3,
            cursor: "pointer",
            ...containerStyle,
          }}
          onClick={disabled ? () => console.log("Not authorized") : onClick}
        />
      ) : (
        <div
          onClick={disabled ? () => console.log("Not authorized") : onClick}
          className="d_flex"
          style={{
            cursor: "pointer",
          }}
        >
          <Icon
            style={{
              ...style,
              ...linkStyle,
            }}
            className=""
            onMouseEnter={toggleHover}
            onMouseLeave={toggleHover}
          />
        </div>
      )}
    </div>
  );
}
