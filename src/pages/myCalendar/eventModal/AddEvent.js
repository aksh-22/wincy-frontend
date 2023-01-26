import React from "react";
import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
import { LightTooltip } from "components/tooltip/LightTooltip";
import EditIcon from "@mui/icons-material/Edit";
function AddEvent({ title, onClick, style , type }) {
  return (
    type === "edit" ? 
    <LightTooltip title="Edit" arrow>
    <EditIcon onClick={onClick} />
  </LightTooltip>
  :
    <div className="eventsListEl" style={style} onClick={onClick}>
      <AddCircleOutlineSharpIcon /> &nbsp;
      {title}
    </div>
  );
}

export default AddEvent;
