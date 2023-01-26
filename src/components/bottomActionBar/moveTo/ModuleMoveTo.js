import React, { useState, useEffect } from "react";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import "./MoveToContainer.scss";
import { LightTooltip } from "components/tooltip/LightTooltip";
import Popover from "@mui/material/Popover";
import { useProjectTeam } from "hooks/useUserType";
import { useQueryClient } from "react-query";
import SearchIcon from "@mui/icons-material/Search";
import { capitalizeFirstLetter } from "utils/textTruncate";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ErrorIcon from "@mui/icons-material/Error";
import { useMoveToModule } from "react-query/milestones/moveTo/useMoveToModule";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IosIcon from "components/icons/IosIcon";
function ModuleMoveTo({ actionButton }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div className="moduleMoveToContainer">
      {actionButton ? (
        <div onClick={handleClick}>{actionButton} </div>
      ) : (
        <LightTooltip arrow title="Move To Module">
          <div className="actionButton" onClick={handleClick}>
            <IosIcon name="share" />
          </div>
        </LightTooltip>
      )}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: actionButton ? "bottom" : "top",
          horizontal: actionButton ? "center" : "right",
        }}
        transformOrigin={{
          vertical: actionButton ? "top" : "bottom",
          horizontal: actionButton ? "center" : "left",
        }}
        PaperProps={{
          style: {
            // background: "var(--popUpColor)",
            background: actionButton ? "var(--popUpColor)" : "#2F3453",
            color: "#FFF",
            width: 300,
            // boxShadow : actionButton && "0px 0px 10px 5px #ffffff45"
          },
        }}
      >
        <MilestoneList handleClose={handleClose} />
      </Popover>
    </div>
  );
}

export default ModuleMoveTo;

const MilestoneList = ({ handleClose }) => {
  const { orgId, projectId } = useProjectTeam();
  const queryClient = useQueryClient();
  const [milestoneList, setMilestoneList] = useState([]);
  const { location } = useHistory();
  useEffect(() => {
    onSetMilestone();
  }, []);

  const onSetMilestone = () => {
    let milestone = queryClient.getQueryData(["milestones", orgId, projectId]);
    if (milestone?.milestones) {
      setMilestoneList(milestone?.milestones);
    }
  };
  // Handle Search
  // const [search, setSearch] = useState("")
  const onSearchHandle = (e) => {
    const value = e.target.value;
    if (!value.trim().length) {
      onSetMilestone();
      return;
    }
    let result = milestoneList.filter((item) =>
      item?.title?.toLowerCase().includes(value?.toLowerCase())
    );
    if (result) {
      setMilestoneList([...result]);
    }
  };
  // On Handle Click
  const { mutate } = useMoveToModule();
  const isModuleSelected = useSelector(
    (state) => state.userReducer?.isModuleSelected
  );
  const onMilestoneClick = (milestoneId) => {
    mutate({
      data: {
        modules: isModuleSelected,
      },
      orgId,
      projectId,
      milestoneId: location?.pathname.split("/")?.[4],
      handleClose,
      toMilestoneId: milestoneId,
    });
  };
  return (
    <div
      //  style={{
      //    maxHeight : 200,
      //    overflowY:"auto",
      //    minWidth : 400
      //  }}
      className="popoverContainerModuleMoveTo"
    >
      <div className="searchContainer">
        <input
          type="search"
          placeholder="Search Milestone Name"
          onChange={onSearchHandle}
        />
        <SearchIcon />
      </div>
      <div className="milestoneContainerMoveTo">
        {!milestoneList?.length ? (
          <div
            className="alignCenter flexColumn noMilestoneFound"
            // style={{
            //   position: "absolute",
            //   transform: "translate(50%, -50%)",
            //   top: "65%",
            //   right: "50%",
            // }}
          >
            <IosIcon
              name="notFound"
              style={{
                width: 100,
                height: 100,
                marginBottom: 20,
              }}
            />

            <p>{`No Milestone Found`}</p>
          </div>
        ) : (
          // <div className="noMilestoneFound">
          //   <ErrorIcon /> <p>No Milestone Found</p>
          // </div>
          milestoneList?.map(
            (item, index) =>
              item?._id !== location?.pathname.split("/")?.[4] && (
                <div
                  key={item?._id}
                  className="milestoneNameRow"
                  onClick={() => onMilestoneClick(item?._id)}
                >
                  <ArrowCircleDownIcon className="rotateArrowMoveTo" />
                  <p className="textEllipse">
                    {capitalizeFirstLetter(item?.title)}
                  </p>
                </div>
              )
          )
        )}
      </div>
    </div>
  );
};
