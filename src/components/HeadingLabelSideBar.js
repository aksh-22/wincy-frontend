import React from 'react'
import projectCard from "css/ProjectCard.module.css";
import SecurityOutlinedIcon from "@material-ui/icons/SecurityOutlined";
import GrainIcon from '@material-ui/icons/Grain';
function HeadingLabelSideBar({type , icon , text}) {
    return (
        <div
        className={`${projectCard.blockSensitive} mb-1 d_flex alignCenter`}
        style={{
          border: "1px solid var(--divider)",
        }}
      >
          {type === "basic" && <GrainIcon style={{ fontSize: 16 }} />}
          {type === "sensitive" && <SecurityOutlinedIcon style={{ fontSize: 16 }} />}
          {type === "custom" && icon}
        
        &nbsp; <p className="ff_Lato_Regular">
        {type === "basic" && "Basic Information"}
        {type === "sensitive" && "Sensitive Information"}
        {type === "custom" && text}
        </p>{" "}
      </div>
    )
}

export default HeadingLabelSideBar
