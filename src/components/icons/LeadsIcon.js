import React , { useState } from 'react'
import { ReactComponent as Icon } from "assets/svg/leads.svg";
function LeadsIcon({className , color , height , width , onClick  , hoverColor}) {
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
       <div 
       className={className}
       style={{height : 20 , width : 20}}
       onClick={onClick}

       >
            <Icon 
        style={{
              height:height??15,
            width: width??15
        } , {...linkStyle}}
        className=""
        onMouseEnter={toggleHover} onMouseLeave={toggleHover}
        />
           </div>
    )
}

export default LeadsIcon
