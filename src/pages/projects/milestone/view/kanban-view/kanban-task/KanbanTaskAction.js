import React from 'react'
import Dialog from '@mui/material/Dialog';
import KanbanTaskView from './KanbanTaskView';
function KanbanTaskAction({open , handleClose , taskInfo}) {
    // const [open, setOpen] = React.useState(true);
    // const handleClickOpen = () => {
    //     setOpen(true);
    //   };
    
    //   const handleClose = (value) => {
    //     setOpen(false);
    //   };
    return (
        <>
        <Dialog classes={{ paper: "kanbanpopup" }} onClose={handleClose} open={open}> 
        <KanbanTaskView taskInfo={taskInfo} handleClose={handleClose} />
        </Dialog> 
        </>
       
    )
}

export default KanbanTaskAction
