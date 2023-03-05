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
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useProjectTeam } from "hooks/useUserType";

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
  const queryClient = useQueryClient();
  const milestones = queryClient.getQueryData(["milestones", orgId, projectId]);
  const [milestoneList, setMilestoneList] = useState([]);
  useEffect(() => {
    setMilestoneList(milestones?.milestones);
  }, [milestones]);
  const onSelectMilestone = () => {};
  const { push } = useHistory();
  const { projectInfo } = useProjectTeam();

  return !selectedMilestone && projectInfo ? (
    <TableRowSkeleton height={50} />
  ) : (
    <div className="milestoneChangerContainer">
      <div className="sss">
        <div className="sidebar_milestone" />
        <ul>
          {milestoneList?.map(
            (item, index) =>
              index < 3 && (
                <li
                  onClick={() => {
                    setSelectedMilestone(item);

                    push({
                      pathname: `/main/projects/${projectId}/${item?._id}`,
                      state: {
                        _id: item?._id,
                        module: true,
                        milestoneInfo: item,
                      },
                    });
                  }}
                  key={item?._id}
                  className={`${
                    selectedMilestone?._id === item?._id &&
                    "selected_milestone_tab"
                  } cursorPointer ${
                    milestoneList?.length > 3
                      ? index === 2
                        ? "last-child-milestone-tree"
                        : null
                      : milestoneList?.length - 1 === index
                      ? "last-child-milestone-tree"
                      : null
                  }`}
                >
                  <span className="border-top-milestone " />
                  <div className="milestone_bar ">
                    <span className="" />
                    <div className="alignCenter justifyContent_center">
                      <p>{item?.title}</p>
                      <LightTooltip title="Info" arrow>
                        <div
                          className="alignCenter"
                          onClick={toggleMilestoneInfo}
                        >
                          <Icon
                            name="info"
                            style={{
                              cursor: "pointer",
                              marginLeft: 5,
                              height: 18,
                              width: 18,
                            }}
                          />
                        </div>
                      </LightTooltip>
                    </div>
                  </div>
                </li>
              )
          )}
          {milestoneList?.length > 3 && (
            <div className="remaining_milestone_count" onClick={handleClick}>
              <p>{milestoneList?.length - 3}</p>
              <div className="arrow_container_milestone_changer">
                <ArrowRightIcon />
              </div>
            </div>
          )}
        </ul>
      </div>
      <Popover
        id={"milestone_changer"}
        open={anchorEl}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        PaperProps={{
          style: {
            background: "var(--popUpColor)",
            color: "#FFF",
          },
        }}
      >
        <MilestoneNameList
          projectId={projectId}
          handleClose={handleClose}
          setSelectedMilestone={setSelectedMilestone}
          setMilestoneList={setMilestoneList}
          milestoneList={milestoneList}
        />
      </Popover>
    </div>
  );
}

export default MilestoneChanger;

const MilestoneNameList = ({
  projectId,
  handleClose,
  setSelectedMilestone,
  selectedMilestone,
  milestoneList,
  setMilestoneList,
}) => {
  const { push } = useHistory();
  const onChangeMilestoneSelect = (event, index) => {
    const info = event;
    let temp = milestoneList;
    [temp[0], temp[index]] = [temp[index], temp[0]];
    setMilestoneList(temp);
    setSelectedMilestone(info);

    push({
      pathname: `/main/projects/${projectId}/${info?._id}`,
      state: { _id: info?._id, module: true, milestoneInfo: info },
    });
    handleClose();
  };

  return (
    <div className="milestone_changer_dropdown textEllipse">
      {milestoneList?.map(
        (item, index) =>
          index >= 3 &&
          selectedMilestone?._id !== item?._id && (
            <div
              className="milestoneChangerContainer_row"
              key={item?._id}
              onClick={() => onChangeMilestoneSelect(item, index)}
            >
              <p className="textEllipse flex">
                {capitalizeFirstLetter(item?.title)}
              </p>
            </div>
          )
      )}
    </div>
  );
};
