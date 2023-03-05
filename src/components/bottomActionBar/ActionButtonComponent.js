import IosIcon from "components/icons/IosIcon";
import React, { memo } from "react";
import { LightTooltip } from "components/tooltip/LightTooltip";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
const MoveToActionComponent = ({ onClick, type, className }) => {
  return (
    <LightTooltip arrow title={type === "copy" ? "Copy To" : "Move To"}>
      <div className={`actionButton ${className}`} onClick={onClick}>
        {type === "copy" ? (
          <ContentCopyRoundedIcon />
        ) : (
          <IosIcon name="share" />
        )}
      </div>
    </LightTooltip>
  );
};

export default MoveToActionComponent;
