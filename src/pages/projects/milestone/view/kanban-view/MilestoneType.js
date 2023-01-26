import MilestoneCard from 'components/milestoneCard/MilestoneCard';
import React from 'react';
import { useState } from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { IconButton } from '@material-ui/core';
import CustomButton from 'components/CustomButton';
import CloseIcon from '@mui/icons-material/Close';
import { useRef } from 'react';
import { useEffect } from 'react';
import { useAddMilestone } from 'react-query/milestones/useAddMilestone';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
const grid = 8;

const getItemStyle = (snapshot, draggableStyle , disabled) => {
  if (!snapshot.isDropAnimating) {
    return {
      userSelect: 'none',
      margin: `0 0 ${grid}px 0`,
      opacity : disabled ? 0.5 : 1,
      ...draggableStyle,
    };
  }

  return {
    ...draggableStyle,
    transitionDuration: `0.001s`,
    opacity : disabled ? 0.5 : 1,
  };
};

const getListStyle = (isDraggingOver) => ({
  backgroundColor: 'var(--projectCardBg)',
  padding: grid,
  width: 250,
  marginRight: 25,
  borderBottom: 'solid 6px #40487A ',
});

const MilestoneType = ({ droppableId, columnNo, items, canAddMilestone ,projectId , orgId , milestonesData , disabled }) => {
  const [toggleInput, setToggleInput] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState("");
  const textAreaRef = useRef(null);
  const handleClose = () => {
    setToggleInput(false)
  }
  const {mutate } = useAddMilestone(handleClose)

  useEffect(() => {
    if (toggleInput) {
      textAreaRef?.current?.scrollIntoView({
        block: 'nearest',
        inline: 'center',
        behavior: 'smooth',
        alignToTop: false,
      });
    }
  }, [toggleInput]);

  const getItemName = (rowNo) => {
    switch (rowNo) {
      case 1:
        return 'Active';
      case 2:
        return 'Not Started';
      case 3:
        return 'Completed';
      default:
        return 'Dummy';
    }
  };
  const getMilestoneTypeColor = (rowNo) => {
    switch (rowNo) {
      case 1:
        return 'var(--chipBlue)';
      case 2:
        return '#FFB300';
      case 3:
        return 'var(--green)';
      default:
        return 'orange';
    }
  };

  const onSubmit = () => {
    const tempData = milestonesData?.filter(
      (item) =>
        item?.title?.toLowerCase()?.trim() ===
        input.toLowerCase()?.trim()
    );
    if (tempData.length) {
      return setError("Milestone name already exists.");
    }
    if (!input?.trim()) {
      return setError("Milestone name is required.");
    }
    // setLoadingButton(buttonType)

          let data = {
        projectId: projectId,
        orgId: orgId,
        buttonType : 'save',
        view:"kanban",
        data: {
          title: input,
        },
      };
      mutate(data);
      setInput("")
  };

  return (
    <div
      className='d_flex'
      style={{
        flexDirection: 'column',
        maxWidth: 350,
        marginRight: 25,
      }}>
      <div
        style={{
          backgroundColor: getMilestoneTypeColor(columnNo),
          padding: 10,
          borderRadius:"2px 2px 0px 0px"
        }}>
        {getItemName(columnNo)}
      </div>
      <Droppable droppableId={droppableId} isDropDisabled={disabled}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              ...getListStyle(snapshot.isDraggingOver),
              ...{
                maxHeight: '60vh',
                minWidth: '350px',
                overflowY: 'auto',
                padding: '20px 10px 20px 10px',
              },
            }}>
            {items?.map((item, index) => (
              <Draggable
                key={String(item._id)}
                draggableId={String(item._id)}
                index={index}
                isDragDisabled={disabled || item?.disabled}
                >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(
                      snapshot,
                      provided.draggableProps.style,
                      item?.disabled
                    )}>
                    <MilestoneCard
                      info={item}
                      isDragging={snapshot.isDragging}
                      orgId={orgId}
                      projectId={projectId}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {toggleInput ? (
              <>
                <div
                  style={{
                    backgroundColor: 'var(--milestoneCard)',
                    width: '100%',
                  }}>
                  <textarea
                    rows={4}
                    spellCheck={true}
                    onChange={(e) => {
                      setError("")
                      setInput(e.target.value)
                    }}

                    onKeyPress={(event) => {
                      if (
                        event.key === "Enter" &&
                        event.shiftKey
                      ) {
                      }
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();
                        event.stopPropagation();
                        onSubmit()
                      }
                    }}

                    placeholder='Enter milestone name'
                    autoFocus={true}
                    value={input}
                    style={{
                      width: '100%',
                      border: 'none',
                      outline: 0,
                      backgroundColor: 'var(--milestoneCard)',
                      paddingLeft: 5,
                      paddingTop: 5,
                      color: '#fff',
                      fontSize: 14,
                      fontFamily: 'sans-serif',
                    }}
                  />
                </div>
                {error &&  <p
                  style={{
                    color:"var(--red)",
                    fontSize:12,
                    display:"flex",
                    alignItems:"center",
                    marginTop:10
                  }}
                  ><ErrorRoundedIcon 
                  style={{
                    fontSize:16,
                    marginRight:2
                  }}
                  />{error}</p>}
                <div ref={textAreaRef} style={{ marginTop: 20 }}>
                  <CustomButton style={{ width: 80 }}
                  onClick={onSubmit}
                  > Add </CustomButton>
                  <IconButton
                    onClick={() => {
                      setToggleInput((prev) => !prev);
                      setInput('');
                    }}>
                    <CloseIcon style={{ fontSize: 20, color: 'white' }} />
                  </IconButton>
                </div>
              </>
            ) : null}
          </div>
        )}
      </Droppable>
      {(canAddMilestone && !disabled) ? (
        !toggleInput ? (
          <div
            onClick={() => setToggleInput((prev) => !prev)}
            style={{
              backgroundColor: 'var(--milestoneCard)',
              padding: '10px 0px 10px 20px',
              cursor: 'pointer',
              borderTop: '1px solid var(--milestoneCard)',
            }}>
            + Add New Milestone
          </div>
        ) : null
      ) : null}
    </div>
  );
};

export default MilestoneType;
