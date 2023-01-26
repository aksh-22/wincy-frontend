import Checkbox from "@material-ui/core/Checkbox";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import CustomMenu from "components/CustomMenu";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import Image from "components/defaultImage/Image";
import InfoIcon from "components/icons/InfoIcon";
import Icon from "components/icons/IosIcon";
import { LightTooltip } from "components/tooltip/LightTooltip";
import "css/Milestone.css";
import { useProjectTeam } from "hooks/useUserType";
import { useCallback } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import { getBugStatusFunction, priorityArray } from "utils/status";
import { previousDateFunction } from "../../../utils/status";
import classes from "./Bug.module.css";
import BugInfoSidebar from "./BugInfoSidebar";
import { checkEditAccess, checkUserAuth } from "./BugTable";

function BugRowItem({
  item,
  i,
  isSelected = [],
  editEnable,
  onHandleSelect,
  taskId,
  mutate,
  orgId,
}) {
  const userId = useSelector((state) => state.userReducer?.userData?.user?._id);
  const { project, team, actionDisabled } = useProjectTeam();
  const [isOpen, setIsOpen] = useState(false);

  const handleStatus = useCallback((selectedMenuItem) => {
    let data = {
      status: selectedMenuItem.value,
    };

    let sendData = {
      orgId: orgId,
      bugId: item?._id,
      data: data,
    };
    selectedMenuItem.value !== undefined && mutate(sendData);
  }, []);

  const handleAssigneeUpdate = useCallback(({ otherId, teamData, teamIds }) => {
    mutate({
      orgId: orgId,
      bugId: otherId,
      data: {
        assignees: teamIds ?? "",
      },
      additionalInfo: {
        assignees: teamData,
      },
    });
  }, []);

  const handlePriority = useCallback((selectedMenuItem) => {
    let data = {
      priority: selectedMenuItem?.value,
    };

    let sendData = {
      orgId: orgId,
      bugId: item?._id,
      data: data,
    };
    selectedMenuItem?.value && mutate(sendData);
  }, []);

  const onHandleTitleUpdate = useCallback((value) => {
    let data = {
      title: value,
    };

    let sendData = {
      orgId: orgId,
      bugId: item?._id,
      data: data,
    };
    mutate(sendData);
  }, []);

  return (
    <div className={`${classes.bugRow2} `}>
      <div
        className={`subMilestone_sideLine d_flex alignCenter ${
          isSelected.length !== 0 ? "rowSelected" : ""
        }  ${editEnable === item?._id ? "backgroundChangeOnEdit" : ""} ${
          userId !== item?.createdBy?.[0]?._id && "cursorNotAllowed"
        }  ${item?.testerStatus === "Approved" ? "completedRowSideLine" : ""}`}
      >
        <Checkbox
          size="small"
          checked={isSelected.includes(item?._id)}
          onClick={() => onHandleSelect(item?._id)}
          disabled={checkEditAccess(userId, item, actionDisabled)}
        />
      </div>
      <div className={`alignCenter d_flex pr-1`}>
        <LightTooltip title={`${project?.title?.substring(0, 3)}#${item?.sNo}`}>
          <p className="date" style={{ textTransform: "uppercase" }}>
            {project?.title?.substring(0, 3)?.toLowerCase()}#{item?.sNo}
          </p>
        </LightTooltip>
      </div>

      <div className="alignCenter textEllipse">
        <InputTextClickAway
          value={item?.title}
          height={30}
          className="mr-1 textEllipse"
          textClassName={"textEllipse"}
          onChange={onHandleTitleUpdate}
        />
        {item?.description && (
          <LightTooltip title="Description" arrow>
            <div
              className="mx-1 cursorPointer"
              onClick={() => {
                // item?._id !== "localData" && setCurrentBug(i);
                // toggleShowInfo();
              }}
            >
              <Icon name="menu" />
            </div>
          </LightTooltip>
        )}

        {item?.attachments?.length > 0 && (
          <LightTooltip
            title={`${item?.attachments?.length} Attachment(s)`}
            arrow
          >
            <div
              className="alignCenter mr-1 cursorPointer"
              onClick={() => {
                //   item?._id !== "localData" && setCurrentBug(i);
                //   toggleShowInfo();
              }}
            >
              <AttachFileRoundedIcon
                style={{
                  fontSize: 16,
                  color: "#8a9aff",
                }}
              />
            </div>
          </LightTooltip>
        )}

        {item?.comments?.length > 0 && (
          <LightTooltip title="Comment" arrow>
            <div
              className="alignCenter mr-1 cursorPointer"
              onClick={() => {
                // item?._id !== "localData" && setCurrentBug(i);
                // toggleShowInfo();
              }}
            >
              <CommentRoundedIcon
                style={{
                  fontSize: 16,
                  color: "#8a9aff",
                  marginTop: 4,
                }}
              />
            </div>
          </LightTooltip>
        )}
      </div>

      <LightTooltip arrow title="Info">
        <div className="alignCenter" style={{marginBottom:5}}>
          <InfoIcon
            onClick={() => {
              //   item?._id !== "localData" && setCurrentBug(i);
              //   toggleShowInfo();
              setIsOpen(true);
            }}
            className="cursorPointer"
          />
        </div>
      </LightTooltip>

      <div
        className="d_flex alignCenter"
        style={{ width: "100%", padding: "0px 15px" }}
      >
        <div className="d_flex alignCenter ">
          <Image
            type="createdBy"
            src={
              Array.isArray(item?.createdBy)
                ? item?.createdBy?.[0]?.profilePicture
                : item?.createdBy?.profilePicture
            }
            title={
              Array.isArray(item?.createdBy)
                ? item?.createdBy?.[0]?.name
                : item?.createdBy?.name
            }
          />
          <p style={{ width: 10, margin: "0px 10px" }}>|</p>{" "}
        </div>
        <div className="flex d_flex ">
          <AssigneeSelection
            team={team}
            assignee={item?.assignees}
            onChange={handleAssigneeUpdate}
            otherId={item?._id}
            disabled={checkUserAuth(item, userId, actionDisabled)}
            multiple
            needOneMember={true}
          />
        </div>
      </div>

      <div
        className={`subMilestone_priority milestone_cell border_solid_bottom border_solid_left `}
      >
        <CustomMenu
          menuItems={getBugStatusFunction(item?.status)}
          id={item?._id}
          mutate={item?.mutate}
          menuName="bugStatus"
          handleMenuClick={handleStatus}
          // name={currentlyEditingMenu}
          activeMenuItem={addSpaceUpperCase(item?.status)}
          disabled={checkUserAuth(item, userId, actionDisabled)}
        />
      </div>
      <div
        className={`subMilestone_assignee milestone_cell border_solid_bottom border_solid_left`}
      >
        <CustomMenu
          menuItems={priorityArray}
          id={item?._id}
          // name={currentlyEditingMenu}
          mutate={item?.mutate}
          disabled={
            !actionDisabled ? false : userId !== item?.createdBy?.[0]?._id
          }
          handleMenuClick={handlePriority}
          activeMenuItem={addSpaceUpperCase(item?.priority)}
        />
      </div>
      <div style={{ textAlign: "center" }}>
        {item?.createdAt ? previousDateFunction(item?.createdAt) : "N/A"}
      </div>

      <CustomSideBar show={isOpen} toggle={() => setIsOpen(!isOpen)}>
        <BugInfoSidebar
          bug={item}
          projectInfo={project}
          platform={item?.platform}
          team={team}
          disabled={checkEditAccess(userId, item, actionDisabled)}
          secondDisable={checkUserAuth(item, userId, actionDisabled)}
          fromModule="taskBug"
          taskId={taskId}
        />
      </CustomSideBar>
    </div>
  );
}

export default BugRowItem;
