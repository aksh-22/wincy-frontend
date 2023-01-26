import { IconButton } from '@material-ui/core'
import React, { useState } from 'react'
import { LightTooltip } from './tooltip/LightTooltip'
import CloseIcon from "@material-ui/icons/Close";
import CustomSpeedDial from './CustomSpeedDial';
import CommonDelete from './CommonDelete';
import MoreVertIcon from "@material-ui/icons/MoreVert";

function CloseButton({onClick , isLoading , mutate , data , otherFunction , type , normalClose , editIcon, _id}) {
  const [openFab, setOpenFab] = useState(false);
  const handleFabOpen = () => {
    setOpenFab(true);
  };

  const handleFabClose = (action) => {
    if (action.name === "Esc") {
      onClick()
    }
    
    setOpenFab(false);
  };

    return (
      normalClose ? 
      <CustomSpeedDial
            speedDialIcon={<MoreVertIcon style={{fontSize:16}}/>}
            actionArray={[
             {
                name: "",
                icon: <CommonDelete
                type={type}
                isLoading={isLoading}
                mutate={mutate}
                data={data}
                otherFunction={otherFunction}
                tooltipPlacement='left'
                // disableToolTip
                />,
              },
              {
                name: "",
                icon:<LightTooltip title="Esc" arrow placement='left'>
                   <CloseIcon onClick={onClick}/>
                </LightTooltip>,
              },
            ]}
            open={openFab}
            handleOpen={handleFabOpen}
            handleClose={handleFabClose}
          /> :
        <LightTooltip title="Esc">
        <div className="closeButton" onClick={onClick}>
          <IconButton style={{ color: "var(--defaultWhite)" }}>
            <CloseIcon style={{ fontSize: 16 }} />
          </IconButton>
        </div>
      </LightTooltip>
    )
}

export default CloseButton
