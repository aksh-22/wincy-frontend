import { ClickAwayListener, TextField } from "@material-ui/core";
import SearchIcon from "@mui/icons-material/Search";
import CustomAvatarGroup from "components/customAvatarGroups_k/CustomAvatarGroup";
import CustomChip from "components/CustomChip";
import CustomPopper from "components/CustomPopper";
import Image from "components/defaultImage/Image";
import Icon from "components/icons/IosIcon";
import { LightTooltip } from "components/tooltip/LightTooltip";
import React, { memo, useEffect, useState } from "react";
import { useOrganisationUsers } from "react-query/organisations/useOrganisationUsers";
import { useSelector } from "react-redux";
import { capitalizeFirstLetter, textTruncateMore } from "utils/textTruncate";
import { errorToast } from "utils/toast";
import "./AssigneeSelection.css";
import CheckBoxSquare from "components/icons/CheckBoxSquare";
import CustomButton from "components/CustomButton";

function AssigneeSelection({
  assignee,
  team,
  multiple,
  onChange,
  otherId,
  orgId,
  projectId,
  isProjectManager,
  disabled,
  ImageStyle,
  handleClose,
  style,
  plusDisable,
  maxLength,
  needOneMember,
  contentCenter,
  labelClassName,
  taskInfo,
  widthAuto,
}) {
  const userType = useSelector((state) => state.userReducer?.userType);
  const { data } = useOrganisationUsers(orgId, projectId);
  const [assigneeWithStatus, setAssigneeWithStatus] = useState(null);
  useEffect(() => {
    if (taskInfo?.assigneesStatus) {
      let temp = assignee ? [...assignee] : [];
      let obj = {};
      taskInfo?.assigneesStatus?.map((item, index) => {
        obj[item?.assignee] = item?.status;
        return null;
      });

      temp = assignee?.map((item) => {
        return {
          ...item,
          status: obj[item?._id],
        };
      });
      setAssigneeWithStatus(temp);
    }
  }, [assignee, taskInfo]);

  return (
    <CustomPopper
      widthAuto={widthAuto}
      paperClassName="paperClassNameAssignee"
      labelClassName={labelClassName}
      buttonClassName={
        !contentCenter ? "justifyContent_start inheritParent" : "inheritParent"
      }
      zIndex={1307}
      disabled={disabled ?? !["Admin", "Member++"].includes(userType?.userType)}
      // buttonClassName="inheritParent"
      containerClassName="inheritParent assigneePopover"
      disableRipple
      value={
        multiple ? (
          <>
            {assignee?.length > 0 && (
              <>
                <CustomAvatarGroup
                  data={assigneeWithStatus ?? assignee}
                  style={style}
                  plusDisable={plusDisable}
                  maxLength={maxLength}
                  disabled={
                    disabled ??
                    !["Admin", "Member++"].includes(userType?.userType)
                  }
                />
              </>
            )}

            {(assignee === undefined || assignee?.length === 0) &&
              !disabled && (
                <LightTooltip title="Click to add an assignee" arrow>
                  <div>
                    <Icon name="addRound" />
                  </div>
                </LightTooltip>
              )}
            {/* {(assignee === undefined || assignee?.length === 0) && (
              <Image
                title={
                  Array.isArray(assignee) ? assignee[0]?.name : assignee?.name
                }
                style={{
                  fontSize: Array.isArray(assignee)
                    ? assignee[0]?.name
                      ? 14
                      : 9
                    : assignee?.name
                    ? 14
                    : 9,
                  ...ImageStyle,
                }}
                type={
                  Array.isArray(assignee)
                    ? assignee[0]?.name
                      ? "assignee"
                      : ""
                    : assignee?.name
                    ? "assignee"
                    : ""
                }
                placeholderToolTip={
                  disabled ? "No Assignee" : "Click to add an assignee"
                }
              />
            )} */}
          </>
        ) : (
          <Image
            src={
              Array.isArray(assignee)
                ? assignee[0]?.profilePicture
                : assignee?.profilePicture
            }
            title={Array.isArray(assignee) ? assignee[0]?.name : assignee?.name}
            style={{
              fontSize: Array.isArray(assignee)
                ? assignee[0]?.name
                  ? 14
                  : 9
                : assignee?.name
                ? 14
                : 9,
              ...ImageStyle,
            }}
            type={
              Array.isArray(assignee)
                ? assignee[0]?.name
                  ? "assignee"
                  : ""
                : assignee?.name
                ? "assignee"
                : ""
            }
            placeholderToolTip="No Assignee"
          />
        )
      }
      content={
        <AssigneeSelectionSection
          team={data?.users ?? team}
          assignee={assignee}
          multiple={multiple}
          onChange={onChange}
          otherId={otherId}
          isProjectManager={isProjectManager}
          handleClose={handleClose}
          needOneMember={needOneMember}
          orgId={orgId}
        />
      }
      noHover={true}
    />
  );
}

export default memo(AssigneeSelection);

function AssigneeSelectionSection({
  team,
  assignee,
  multiple,
  onChange,
  otherId,
  isProjectManager,
  handleClose,
  needOneMember,
  orgId,
}) {
  const [currentAssignee, setCurrentAssignee] = useState(
    assignee ? (Array.isArray(assignee) ? [...assignee] : [assignee]) : []
  );
  const [search, setSearch] = useState(null);
  const [searchData, setSearchData] = useState(null);
  const removeAssignee = (id) => {
    setCurrentAssignee(currentAssignee?.filter((item) => item?._id !== id));
  };
  const addAssignee = (item) => {
    if (multiple) {
      setCurrentAssignee([...currentAssignee, item]);
    } else {
      setCurrentAssignee([item]);
    }
    setSearch("");
    setSearchData(null);
  };
  const addProjectHead = (event, headData) => {
    event.stopPropagation();
    let newData = [];
    if (multiple) {
      newData = currentAssignee?.map((item) => {
        return {
          ...item,
        };
      });
      setCurrentAssignee([
        {
          ...headData,
          projectHead: true,
        },
        ...newData,
      ]);
    } else {
      setCurrentAssignee([
        {
          ...headData,
          projectHead: true,
        },
      ]);
    }
    setSearch("");
    setSearchData(null);
  };
  const renderDiv = (item, index) => {
    let isProjectManagerTemp = currentAssignee?.find(
      (row) => row?._id === item?._id && row?.projectHead
    );
    let findData = currentAssignee?.find((row) => row?._id === item?._id);
    if (findData) {
      return null;
    }
    return (
      <div
        key={index}
        className="d_flex alignCenter assigneeRowContainer "
        onClick={() => findData ?? isProjectManagerTemp ?? addAssignee(item)}
        style={{
          opacity: findData ? 0.5 : 1,
          cursor: findData ? "default" : "pointer",
        }}
      >
        <Image
          className="imageAvatar"
          placeHolderClassName="imagePlaceHolder"
          src={item?.profilePicture}
          title={item?.name}
        />{" "}
        &nbsp;&nbsp;
        <LightTooltip title={item?.name.length > 25 ? item?.name : ""}>
          <div className={"flex"}>
            <p>{textTruncateMore(capitalizeFirstLetter(item?.name), 25)}</p>
          </div>
        </LightTooltip>
        {isProjectManager && (
          <>
            <LightTooltip title="Add as Team Member">
              <div
                className="projectManagerIcon"
                // onClick={(e) => addProjectHead(e, item)}
              >
                {" "}
                {/* <ProjectManager className=" projectHeadIcon " /> */}
                {/* <Image
              src={TeamIcon}
              /> */}
                <Icon name="teamMember" style={{ height: 20 }} />
              </div>
            </LightTooltip>
            {item?.userType?.filter(
              (item) =>
                item?.organisation === orgId &&
                ["Admin", "Member++", "Member+"].includes(item?.userType)
            ).length > 0 && (
              <LightTooltip title="Add as Project Manager">
                <div
                  className="projectManagerIcon ml-1"
                  onClick={(e) => !findData && addProjectHead(e, item)}
                >
                  {" "}
                  {/* <ProjectManager className=" projectHeadIcon " /> */}
                  <Icon name="projectManager" style={{ height: 20 }} />
                </div>
              </LightTooltip>
            )}{" "}
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownHandler, false);
    return () => {
      document.removeEventListener("keydown", onKeyDownHandler, false);
    };
  }, [currentAssignee]);

  const onKeyDownHandler = (e) => {
    if (e.keyCode === 13) {
      onOutSideClick();
      handleClose();
    }
  };
  const onOutSideClick = () => {
    if (currentAssignee?.length === 0 && needOneMember) {
      return errorToast("Bugs need at least one assignee");
    }
    if (multiple) {
      const preTeam = [];
      let preHead = [];
      // let preHead;
      assignee?.forEach((element) => {
        preTeam.push(element._id);
        if (element?.projectHead) {
          preHead.push(element._id);
          // preHead = element._id;
        }
      });

      const currTeam = [];
      let currHead = [];
      // let currHead;
      currentAssignee.forEach((element) => {
        currTeam.push(element._id);
        if (element?.projectHead) {
          currHead.push(element._id);
          // currHead = element._id;
        }
      });

      let flag = 0;
      const objPre = {};
      let teamIds = [];
      let teamData = [];
      currentAssignee.length > 0 &&
        currentAssignee?.map((item) => {
          teamIds.push(item?._id);
          teamData?.push(item);
          return null;
        });
      if (preHead !== currHead) {
        onChange({
          assigneeData: currentAssignee,
          otherId: otherId,
          teamIds,
          teamData,
        });
      } else if (preTeam?.length !== currTeam?.length) {
        onChange({
          assigneeData: currentAssignee,
          otherId: otherId,
          teamIds,
          teamData,
        });
      } else {
        preTeam.forEach((element) => {
          objPre[`${element}`] = element;
        });

        for (let i = 0; i < currTeam?.length; i++) {
          if (!objPre[`${currTeam[i]}`]) {
            flag = 1;
            break;
          }
        }

        if (flag === 1) {
          onChange({
            assigneeData: currentAssignee,
            otherId: otherId,
            teamIds,
            teamData,
          });
        }
      }
    } else {
      if (
        currentAssignee.filter((row) => row?._id === assignee?._id)?.length !==
        0
      ) {
        return console.log("Value not change");
      }
      onChange({
        assigneeId: currentAssignee[0]?._id,
        otherId: otherId,
        assigneeData: currentAssignee[0],
      });
    }
  };

  const handleSearch = (event) => {
    const { value } = event?.target;
    setSearch(value);
    if (!value?.trim()?.length) {
      return setSearchData(null);
    }
    let result = team?.filter((item) =>
      item?.name?.toLowerCase().includes(value?.toLowerCase())
    );

    setSearchData(result);
  };
  return (
    <ClickAwayListener onClickAway={onOutSideClick}>
      <div style={{ backgroundColor: "var(--popUpColor)" }} className="py-1">
        {team?.length === 0 && (
          <p
            className="d_flex alignCenter justifyContent_center "
            style={{ color: "#FFF" }}
          >
            No Team Member Available
          </p>
        )}

        <div className="alignCenter justifyContent_end mr-1 mb-1">
          <CustomButton
            style={{
              height: 30,
              minWidth: "auto",
            }}
            onClick={() => {
              onOutSideClick();
              handleClose();
            }}
          >
            <p>Done</p>
          </CustomButton>
        </div>

        <div className="px-1" style={{ maxWidth: 300 }}>
          {isProjectManager &&
            currentAssignee?.map(
              (item, index) =>
                item.projectHead && (
                  <CustomChip
                    avatar={
                      <Image
                        className="imageAvatarChip"
                        placeHolderClassName="imagePlaceHolder imagePlaceHolderChip"
                        src={item?.profilePicture}
                        title={item?.name}
                      />
                    }
                    label={capitalizeFirstLetter(item?.name ?? "")}
                    handleClose={() => removeAssignee(item?._id)}
                    key={index}
                    className="mr-05 mb-05"
                  />
                )
            )}

          {isProjectManager && <div className="divider my-1" />}
          {currentAssignee?.map((item, index) =>
            isProjectManager ? (
              !item.projectHead && (
                <CustomChip
                  avatar={
                    <Image
                      className="imageAvatarChip"
                      placeHolderClassName="imagePlaceHolder imagePlaceHolderChip"
                      src={item?.profilePicture}
                      title={item?.name}
                    />
                  }
                  label={capitalizeFirstLetter(item?.name ?? "")}
                  handleClose={() => removeAssignee(item?._id)}
                  key={index}
                  className="mr-05 mb-05"
                />
              )
            ) : (
              <CustomChip
                avatar={
                  <Image
                    className="imageAvatarChip"
                    placeHolderClassName="imagePlaceHolder imagePlaceHolderChip"
                    src={item?.profilePicture}
                    title={item?.name}
                  />
                }
                label={capitalizeFirstLetter(item?.name ?? "")}
                handleClose={() => removeAssignee(item?._id)}
                key={index}
                className="mr-05 mb-05"
              />
            )
          )}
        </div>
        {
          // currentAssignee?.length !== team?.length &&
          <>
            <div
              className="alignCenter"
              style={{
                border: "1px solid #FFF",
                margin: 10,
                padding: "5px 10px",
                borderRadius: 4,
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <TextField
                placeholder="Search Assignee"
                variant="standard"
                className="inputSearch p-0"
                autoFocus
                type="text"
                onChange={handleSearch}
                value={search}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              />
              <SearchIcon style={{ color: "#FFF" }} />
            </div>

            <div style={{ position: "relative" }} className="px-1">
              {" "}
              <div className="peopleText">
                {" "}
                <span>Team</span>
              </div>
            </div>

            <div
              style={{
                maxHeight: 200,
                overflowY: "auto",
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              {searchData === null ? (
                team?.map((item, index) => renderDiv(item, index))
              ) : searchData?.length > 0 ? (
                searchData?.map((item, index) => renderDiv(item, index))
              ) : (
                <div className="alignCenter flexColumn">
                  <Icon
                    name="notFound"
                    style={{
                      width: 100,
                      height: 100,
                      marginBottom: 20,
                    }}
                  />

                  <p>{`No Assignee Found`}</p>
                </div>
              )}
            </div>
          </>
        }
      </div>
    </ClickAwayListener>
  );
}
