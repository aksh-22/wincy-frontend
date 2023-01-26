import React from 'react'
import './Cell.css'
function Cell({title , backgroundColor , borderNone , alignLeft , style , isAnimation}) {
    return (


    borderNone ? 
    <div className="cell "
    style={{
        backgroundColor: backgroundColor,
        border:borderNone && "none",
        textAlign:alignLeft ? "left" : "",
        fontSize : borderNone ? 12 : 13,
        ...style
    }}
    >  
        {title}
    </div>
    :


       
  <div className={`cell  ${isAnimation ? "create-button1 rainbow" : ""}`}
style={{
    backgroundColor: isAnimation ? "" :backgroundColor,
    border:borderNone && "none",
    textAlign:alignLeft ? "left" : "",
    fontSize : borderNone ? 12 : 13,
    ...style
}}
>  
   <div 
   style={{
       zIndex:999
   }}
   >
   {title}
   </div>
</div>

     
    )
}

export default Cell
