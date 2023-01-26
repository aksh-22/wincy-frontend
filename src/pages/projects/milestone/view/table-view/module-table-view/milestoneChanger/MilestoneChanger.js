import React, { useState, useEffect } from "react";
import Popover from "@mui/material/Popover";
import { LightTooltip } from "components/tooltip/LightTooltip";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import "./MilestoneChanger.scss";
import { useQueryClient } from "react-query";
import { useHistory } from "react-router";
import { capitalizeFirstLetter } from "utils/textTruncate";
import Icon from "components/icons/IosIcon";
import { ClickAwayListener } from "@material-ui/core";
import CustomChip from "components/CustomChip";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";

function MilestoneChanger({
  currentMilestone,
  orgId,
  projectId,
  milestoneInfo,
  toggleMilestoneInfo,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(milestoneInfo);
  useEffect(() => {
    setSelectedMilestone(milestoneInfo);
  }, [milestoneInfo]);
  const handleClick = (event) => {
    setAnchorEl(!anchorEl ? event.currentTarget : null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getMilestoneCompletionPercentage = () => {
    let percentage =
      (parseInt(selectedMilestone?.taskCount?.Completed ?? 0) /
        (parseInt(selectedMilestone?.taskCount?.NotStarted ?? 0) +
          parseInt(selectedMilestone?.taskCount?.Completed ?? 0) +
          parseInt(selectedMilestone?.taskCount?.Active ?? 0) +
          parseInt(selectedMilestone?.taskCount?.UnderReview ?? 0) +
          parseInt(selectedMilestone?.taskCount?.ReviewFailed ?? 0) +
          parseInt(selectedMilestone?.taskCount?.WaitingForReview ?? 0))) *
      100;
    return isNaN(percentage) ? 0 : percentage;
  };
  return (
    <ClickAwayListener
      onClickAway={() => {
        anchorEl && handleClose();
      }}
    >
      {/* <div style={{position:"relative"}}> */}
      <div>
        {!selectedMilestone ? (
          <TableRowSkeleton height={50} />
        ) : (
          <div
            className="milestoneChangerContainer alignCenter"
            onClick={handleClick}
          >
            {/* <div className="milestoneChangerContainer_sideline" style={{
borderRadius : anchorEl ? "6px 0 0 0px" : "6px 0 0 6px",
backgroundColor : statusColors[milestoneInfo?.status]
}}/> */}
            <div className="alignCenter textEllipse">
              <p className="mr-1  textEllipse milestoneChangerContainer_milestoneName ml-1">
                {capitalizeFirstLetter(selectedMilestone?.title ?? "")}
              </p>
              <CustomChip
                label={addSpaceUpperCase(selectedMilestone?.status)}
                className={"mr-1"}
                bgColor={statusColors[selectedMilestone?.status]}
              />
              <LightTooltip title="Info" arrow>
                <div className="alignCenter" onClick={toggleMilestoneInfo}>
                  <Icon name="info" style={{ cursor: "pointer" }} />
                </div>
              </LightTooltip>
            </div>

            <div className="alignCenter">
              <ArrowDropDownIcon
                className={`dropDownArrow ${
                  anchorEl ? "dropDownArrowUP  " : ""
                }`}
              />
            </div>

            <div
              style={{
                background:
                  getMilestoneCompletionPercentage() === 100
                    ? "var(--green)"
                    : "#FFB300",
                height: 3,
                width: `${getMilestoneCompletionPercentage()}%`,
                position: "absolute",
                bottom: 0,
                borderRadius: anchorEl ? "6px 0 0 0px" : "6px 0 0 6px",
                transition: "0.3s ease-out",
              }}
            />
            <div
              className={`milestoneChangerContainer_popper ${
                anchorEl
                  ? "milestoneChangerContainer_popperOpen"
                  : "milestoneChangerContainer_popperClose"
              }`}
            >
              <MilestoneNameList
                orgId={orgId}
                projectId={projectId}
                handleClose={handleClose}
                setSelectedMilestone={setSelectedMilestone}
                anchorEl={anchorEl}
                selectedMilestone={selectedMilestone}
              />
            </div>
          </div>
        )}
      </div>

      {/* <ProgressBar
        percent={75}
        filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"

      /> */}
    </ClickAwayListener>

    // </div>
    //  <Popover
    //   id={id}
    //   open={open}
    //   anchorEl={anchorEl}
    //   onClose={handleClose}
    //   anchorOrigin={{
    //     vertical: "bottom",
    //     horizontal: "left",
    //   }}
    //   // transformOrigin={{
    //   //   vertical: "bottom",
    //   //   horizontal: "left",
    //   // }}
    //   PaperProps={{
    //     style: {
    //       background: "var(--popUpColor)",
    //       // background: "#646991",
    //       color: "#FFF",
    //     },
    //   }}
    // >
    //   <MilestoneNameList orgId={orgId} projectId={projectId} handleClose={handleClose} setSelectedMilestone={setSelectedMilestone}/>
    // </Popover>
  );
  // return (
  //   <div className="milestoneChangerContainer">
  //     <div onClick={handleClick} className="milestoneToggleButton">
  //       <p className="mr-1 flex textEllipse" style={{fontSize  :16}}>{capitalizeFirstLetter(selectedMilestone)}</p>

  //       <ArrowDropDownIcon
  //         className={`dropDownArrow ${anchorEl ? "dropDownArrowUP  " : ""}`}
  //       />
  //     </div>

  //     <Popover
  //       id={id}
  //       open={open}
  //       anchorEl={anchorEl}
  //       onClose={handleClose}
  //       anchorOrigin={{
  //         vertical: "bottom",
  //         horizontal: "left",
  //       }}
  //       // transformOrigin={{
  //       //   vertical: "bottom",
  //       //   horizontal: "left",
  //       // }}
  //       PaperProps={{
  //         style: {
  //           background: "var(--popUpColor)",
  //           // background: "#646991",
  //           color: "#FFF",
  //         },
  //       }}
  //     >
  //       <MilestoneNameList orgId={orgId} projectId={projectId} handleClose={handleClose} setSelectedMilestone={setSelectedMilestone}/>
  //     </Popover>
  //   </div>
  // );
}

export default MilestoneChanger;

const MilestoneNameList = ({
  orgId,
  projectId,
  handleClose,
  setSelectedMilestone,
  anchorEl,
  selectedMilestone,
}) => {
  const queryClient = useQueryClient();
  const {  push } = useHistory();
  // const [selectedMilestone, setSelectedMilestone] = useState({});
  const [milestoneList, setMilestoneList] = useState([]);
  const onChangeMilestoneSelect = (event) => {
    const info = event;
    setSelectedMilestone(info);

    push({
      pathname: `/main/projects/${projectId}/${info?._id}`,
      state: { _id: info?._id, module: true, milestoneInfo: info },
    });
    handleClose();
  };

  const milestones = queryClient.getQueryData(["milestones", orgId, projectId]);
  useEffect(() => {
    setMilestoneList(milestones?.milestones);
  }, [milestones]);

  return (
    <div className="milestoneContainer_Dropdown textEllipse">
      {milestoneList?.map(
        (item, index) =>
          selectedMilestone?._id !== item?._id && (
            <div
              className="milestoneChangerContainer_row"
              key={item?._id}
              onClick={() => onChangeMilestoneSelect(item)}
            >
              <div
                className="milestoneChangerContainer_sideline"
                style={{
                  borderRadius: anchorEl ? "0px 0 0 0px" : "6px 0 0 6px",
                  backgroundColor: statusColors[item?.status],
                }}
              />
              <p className="textEllipse flex">
                {capitalizeFirstLetter(item?.title)}
              </p>
            </div>
          )
      )}
    </div>
  );
};

const statusColors = {
  Active: "#0098EB",
  Completed: "#02CD79",
  NotStarted: "#FFB300",
};
