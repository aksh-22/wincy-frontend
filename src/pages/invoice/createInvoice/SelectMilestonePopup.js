import React, { useState } from "react";
import "./CreateInvoice.scss"
import CheckBoxOutlineBlankOutlinedIcon from '@mui/icons-material/CheckBoxOutlineBlankOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import CustomButton from "components/CustomButton";

function SelectMilestonePopup() {
  return <div className="selectMilestonePopup_container">
    <div className="milestonePopup__list">
    {
          new Array(15).fill("").map((item , index) => <MilestonePopupRow index={index} />)
      }
    </div>
     <div className="alignCenter justifyContent_end my-2 mr-2">
        <CustomButton>
          <p>Done</p>
        </CustomButton>
      </div>
  </div>;
}

export default SelectMilestonePopup;


const MilestonePopupRow = ({index}) => {
    const [isSelected, setIsSelected] = useState(index%2 === 0)
    return <div  className="milestonePopup__row" onClick={() => setIsSelected(!isSelected)}>
        {
            isSelected ? <CheckBoxOutlineBlankOutlinedIcon  fontSize="small"/> :  <CheckBoxOutlinedIcon fontSize="small" />
        }
    <p className="ml-1">Milestone {index}</p>
</div>
}