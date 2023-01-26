import IosIcon from "components/icons/IosIcon";
import React, { memo } from "react";
import { LightTooltip } from "components/tooltip/LightTooltip";

const MoveToActionComponent = ({ onClick, type }) => {
  return (
    <LightTooltip arrow title={type === "copy" ? "Copy To" : "Move To"}>
      <div className="actionButton" onClick={onClick}>
        <IosIcon name="share" />
      </div>
    </LightTooltip>
  );
};

export default MoveToActionComponent;
