import { Button } from "@material-ui/core";
import React from "react";
import PropTypes from "prop-types";
import ClipLoader from "react-spinners/ClipLoader";

function CustomButton({
  children,
  onClick,
  disabled,
  loading = false,
  style,
  type = "contained",
  backgroundColor,
  color,
  width,
  height,
  fontSize,
  className,
  fontFamily,
  ...rest
}) {
  return (
    <Button
      {...rest}
      type="button"
      onClick={(e) => {
        // e.stopPropagation();
        onClick && onClick();
      }}
      disabled={disabled ?? false}
      style={{
        minWidth: width ? width : 100,
        height: height ? height : 35,
        color: type !== "outlined" ? "white" : color ?? "white",
        fontSize: fontSize ? fontSize : 13,
        backgroundColor:
          loading || disabled ? "grey" : backgroundColor ?? "secondary",
        borderRadius: 4,
        textTransform: "capitalize",
        // fontWeight: "bold",
        fontFamily: fontFamily ?? "Lato-Regular",
        ...style,

      }}
      variant={type ?? "contained"}
      color={loading || disabled ? "grey" : backgroundColor ?? "secondary"}
      className={className}
    >
      {children}
      {loading && (
        <div style={{ marginLeft: 5, marginTop: 5 }}>
          <ClipLoader
            loading={loading}
            color={
              type === "contained"
                ? "white"
                : backgroundColor
                ? backgroundColor
                : "black"
            }
            size={14}
          />
        </div>
      )}
    </Button>
  );
}

CustomButton.propTypes = {
  type: PropTypes.oneOf(["contained", "outlined", "text"]),
};

export default CustomButton;
