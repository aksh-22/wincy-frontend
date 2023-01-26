import React from 'react'
import CheckBoxSquare from "components/icons/CheckBoxSquare";
import moment from "moment";
function RequirementRow({data , index}) {
    console.log(data)
    return (
        <div className="d_flex alignCenter"
        style={{
            border:"1px solid #535274",
            padding : 10,
        // textDecoration:index%2 === 0 ? "line-through" : "inherit",
            opacity : index%2 === 0 ? 0.2 : 1,
            fontFamily: index%2 === 0  ? "Lato-Italic" : "Lato-Regular",
        }}
        >
            <CheckBoxSquare 
            className="mr-1"
            isChecked={index%2 === 0}
            />
            <div>
                <p style={{
                    fontSize:12,
                    marginBottom:3
                }}>{data?.title}</p>

               <div className="d_flex "
               style={{fontSize:10}}
               >
               <p className="mr-2" style={{color:"#775CC3"}}>By <span>{data?.createdBy?.[0]?.name}</span></p>
                <p style={{color:"#FABC2A"}}>{moment(data?.createdAt).format("MMM DD ,YYYY")}</p>
               </div>
            </div>
        </div>
    )
}

export default RequirementRow
