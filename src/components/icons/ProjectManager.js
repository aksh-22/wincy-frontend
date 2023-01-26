import React , { useState } from 'react'
import { ReactComponent as Icon } from "assets/svgIcon/projectManager.svg";
import { LightTooltip } from 'components/tooltip/LightTooltip';

function ProjectManager({className , color , height , width , onClick  , hoverColor}) {
   const [hover, setHover] = useState(false)
   const toggleHover = () => {
       setHover(!hover)
   }
   var linkStyle;
    if (hover) {
      linkStyle = {   fill:hoverColor ?? "var(--defaultWhite)"}
    } else {
      linkStyle = {   fill:color ?? "var(--defaultWhite)"}
    }
    return (
    //   <LightTooltip
    //   title="Project Manager"
    //   >
           <div 
       className={className}
       >
            <Icon 
        style={{
              height:height??30,
            width: width??30
        } , {...linkStyle}}
        className=""
        onClick={onClick}
        onMouseEnter={toggleHover} onMouseLeave={toggleHover}
        />
           </div>
    //   </LightTooltip>
    )
}

export default ProjectManager
