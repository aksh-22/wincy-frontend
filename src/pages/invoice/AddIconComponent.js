
import React from "react";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { LightTooltip } from "components/tooltip/LightTooltip";
import "./Invoice.scss"
export const AddIconComponent = ({ onClick ,   tooltipTitle="" }) => {
    return (
      <LightTooltip title={tooltipTitle} arrow>
        <div className={"invoice_add_icon mr-1"} onClick={onClick}>
          <AddRoundedIcon
            style={{
              // marginLeft: "10px",
              color: "var(--defaultWhite)",
              fontSize: 26,
            }}
            type={"contained"}
          />
        </div>
      </LightTooltip>
    );
  };
  