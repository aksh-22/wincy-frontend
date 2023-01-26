import React, { useState, useEffect } from "react";
import Popover from "@mui/material/Popover";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { LightTooltip } from "components/tooltip/LightTooltip";
import "./AssigneeUpdate.scss";
import CustomButton from "components/CustomButton";
import { useProjectTeam } from "hooks/useUserType";
import SearchIcon from "@mui/icons-material/Search";
import ErrorIcon from "@mui/icons-material/Error";
import CheckBoxSquare from "components/icons/CheckBoxSquare";
import Image from "components/defaultImage/Image";
import { useMultipleTaskUpdate } from "react-query/milestones/task/useMultipleTaskUpdate";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
function AssigneesUpdate({actionButton , className  , onAssigneeUpdate , assigneeIds}) {
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
    <div>
      <LightTooltip title="Add Assignees" arrow>
        <div onClick={handleClick} className={`cursorPointer alignCenter ${!actionButton&&"actionButton  mr-1"} ${className}`}>
          {
            actionButton??<AccountCircleIcon />
          }
        </div>
      </LightTooltip>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            background: "var(--popUpColor)",
            // background: "#646991",
            color: "#FFF",
          },
        }}
      >
        <div></div>
        <AssigneeUpdateMultiple handleClose={handleClose} onAssigneeUpdate={onAssigneeUpdate} assigneeIds={assigneeIds}/>
      </Popover>
    </div>
  );
}

export default AssigneesUpdate;

const AssigneeUpdateMultiple = ({ handleClose  , onAssigneeUpdate , assigneeIds }) => {
  const { team, orgId, projectId } = useProjectTeam();
  const { location } = useHistory();
  const [search, setSearch] = useState("");
  const [teamList, setTeamList] = useState([]);
  const [selectedIds, setSelectedIds] = useState(assigneeIds??[]);
  useEffect(() => {
    setTeamList(team);
  }, [team]);
  useEffect(() => {
    onSearchHandle();
  }, [search]);
  const onSearchHandle = () => {
    const value = search;
    if (!value?.trim()?.length) {
      return setTeamList(team);
    }

    let result = team?.filter((item) =>
      item?.name?.toLowerCase().includes(value?.toLowerCase())
    );

    setTeamList([...result]);
  };
  const onSelection = (id) => {
    let temp = [...selectedIds];
    if (id === "all") {
      if (temp?.length === team?.length) {
        temp = [];
      } else {
        temp = [];
        team?.map((item) => {
          temp.push(item?._id);
          return null;
        });
      }
    } else {
      let idExist = temp?.includes(id);
      if (idExist) {
        temp = temp?.filter((item) => item !== id);
      } else {
        temp.push(id);
      }
    }
    setSelectedIds(temp);
  };

  //   Handle Update
  const { mutate } = useMultipleTaskUpdate();
  const isSelected = useSelector((state) => state.userReducer?.isTaskSelected);
  const onSubmit = () => {
    const assigneeData = team?.filter((item) =>
      selectedIds.includes(item?._id)
    );
    console.log(assigneeData);
    onAssigneeUpdate ? onAssigneeUpdate({
      teamData :assigneeData , 
      teamIds : selectedIds,
      handleClose
    }) :
    mutate({
      data: {
        assignees: selectedIds,
        tasks :isSelected
      },
      assignees: assigneeData,
      orgId,
      projectId,
      milestoneId: location?.pathname.split("/")?.[4],
      handleClose,
      isSelected :isSelected
    });
  };
  return (
    <div className="assigneeUpdateContainer">
      <div className="p-1">
        <div className="alignCenter justifyContent_end mb-1">
          <LightTooltip title={!selectedIds?.length && !onAssigneeUpdate ? "Please select assignee first" : ""} arrow>
<div>
  
<CustomButton disabled={onAssigneeUpdate ? false : !selectedIds?.length} onClick={onSubmit}>
            Done
          </CustomButton>
</div>
          </LightTooltip>
        </div>
        <div className="searchContainer">
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => setSearch(e?.target.value)}
            value={search}
          />
          <SearchIcon />
        </div>
      </div>

      {!teamList?.length ? (
        <div className="assigneeContainerRow alignCenter justifyContent_center">
          {" "}
          <ErrorIcon /> <p style={{ paddingLeft: 5 }}>No Member Found</p>
        </div>
      ) : (
        <div className="pl-1">
          <div
            className="alignCenter mb-1"
            style={{ paddingLeft: 5 }}
            onClick={() => onSelection("all")}
          >
            <p className="flex">All</p>
            <CheckBoxSquare
              containerStyle={{
                ...checkBoxStyle,
                marginRight: 15,
              }}
              style={{ ...checkBoxStyle, marginRight: 15 }}
              isChecked={team?.length === selectedIds?.length}
            />
          </div>
          <div className="assigneeContainerRow">
            {teamList?.map((item, index) => (
              <div
                key={item?._id}
                className={`alignCenter assigneeRow_update ${
                  team?.length - 1 === index ? "mb-1" : ""
                }`}
                onClick={() => {
                  onSelection(item?._id);
                  setSearch("");
                }}
              >
                <Image
                  src={item?.profilePicture}
                  title={item?.name}
                  style={{
                    marginRight: 10,
                  }}
                />
                <p className="flex">{item?.name}</p>
                <CheckBoxSquare
                  containerStyle={checkBoxStyle}
                  style={checkBoxStyle}
                  isChecked={selectedIds?.includes(item?._id)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const checkBoxStyle = { height: 14, width: 14, marginRight: 10 };
