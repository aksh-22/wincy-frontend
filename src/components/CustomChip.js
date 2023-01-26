import { IconButton } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import CancelIcon from "@material-ui/icons/Cancel";
import React from "react";
import { textTruncateMore } from "utils/textTruncate";
import { LightTooltip } from "./tooltip/LightTooltip";
export default function CustomChip({
  label = "",
  bgColor,
  className,
  // key,
  handleClose,
  avatar,
  id,
  handleClick,
  style,
}) {
  return (
    label && (
      <LightTooltip title={label ? (label?.length > 25 ? label : "") : ""}>
        <Chip
          clickable={handleClick ?? false}
          avatar={avatar && avatar}
          onDelete={
            handleClose
              ? () => (id ? handleClose(id) : handleClose(label))
              : null
          }
          label={textTruncateMore(label ?? "", 25)}
          style={{
            ...style,
            backgroundColor: bgColor
              ? !bgColor?.includes(",")
                ? bgColor
                : `rgb(${bgColor})`
              : "var(--lightBlue)",
            color: "white",
          }}
          size="small"
          onClick={handleClick}
          // clickable={handleClose ? true : false}
          className={className}
          // key={key}
          deleteIcon={
            handleClose && (
              <IconButton>
                <CancelIcon style={{ color: "white", fontSize: 16 }} />
              </IconButton>
            )
          }
        />
      </LightTooltip>
    )
  );
}
