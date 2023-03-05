import Checkbox from "@material-ui/core/Checkbox";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import CustomMenu from "components/CustomMenu";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import Icon from "components/icons/IosIcon";
import { LightTooltip } from "components/tooltip/LightTooltip";
import { useProjectTeam } from "hooks/useUserType";
import DueDateProgress from "pages/projects/milestone/dueDateProgress/DueDateProgress";
import SubTaskInfoSidebar from "pages/projects/milestone/SubTaskInfoSidebar";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useUpdateTask } from "react-query/milestones/task/useUpdateTask";
import { useDispatch, useSelector } from "react-redux";
import SubTaskList from "./subTask/SubTaskList";
import TaskStatus from "./taskStatus/TaskStatus";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import CustomAvatar from "components/CustomAvatar";

const TaskRowItem = React.forwardRef(
  (
    {
      style,
      provided,
      taskInfo,
      isDragging,
      isTaskDragging,
      disabledSubTask,
      parentId,
      isLastIndex,
      isTaskLastIndex,
    },
    ref
  ) => {
    const orgId = useSelector(
      (state) => state.userReducer?.selectedOrganisation?._id
    );

    const userType = useSelector((state) => state.userReducer?.userType);

    const isSelected = useSelector(
      (state) => state.userReducer?.isTaskSelected
    );

    const isSubTaskSelected = useSelector(
      (state) => state.userReducer?.isSubTaskSelected
    );

    const dispatch = useDispatch();
    const onSelectTask = () => {
      if (parentId) {
        let tempIsSubTaskSelected = isSubTaskSelected;
        let id = taskInfo?._id;
        if (isSubTaskSelected?.[parentId]?.includes(id)) {
          tempIsSubTaskSelected[parentId] = tempIsSubTaskSelected?.[
            parentId
          ]?.filter((item) => item !== id);
          if (!tempIsSubTaskSelected[parentId]?.length) {
            delete tempIsSubTaskSelected[parentId];
          }
        } else {
          tempIsSubTaskSelected?.[parentId]
            ? (tempIsSubTaskSelected[parentId] = [
                id,
                ...tempIsSubTaskSelected?.[parentId],
              ])
            : (tempIsSubTaskSelected[parentId] = [id]);
        }
        dispatch({
          type: "SUB_TASK_SELECT",
          payload: { ...tempIsSubTaskSelected },
        });
      } else {
        let tempIsSelected = [];
        let id = taskInfo?._id;
        if (isSelected?.includes(id)) {
          tempIsSelected = isSelected.filter((item) => item !== id);
        } else {
          tempIsSelected = [id, ...isSelected];
        }
        dispatch({
          type: "TASK_SELECT",
          payload: tempIsSelected,
        });
      }
    };

    const [
      individualStatusUpdatePermission,
      setIndividualStatusUpdatePermission,
    ] = useState(false);

    const { platforms, team, actionDisabled } = useProjectTeam();

    useEffect(() => {
      if (taskInfo?.assignees) {
        let id_Found = taskInfo?.assignees?.find(
          (item) => item?._id === userType?.userId
        );
        if (id_Found) {
          setIndividualStatusUpdatePermission(true);
        }
      }
    }, []);
    //     const { mutate } = useUpdateTask();
    const platformsList = useMemo(
      () =>
        platforms?.map((row) => {
          return {
            label: row,
            value: row,
          };
        }),
      [platforms]
    );
    const teamList = useMemo(() => team, [team]);

    // Update Task Function
    const { mutate } = useUpdateTask();
    const onUpdateCall = (data) => {
      let obj = {
        data,
        milestoneId: taskInfo?.milestone,
        projectId: taskInfo?.project,
        orgId,
        taskId: taskInfo?._id,
        moduleId: taskInfo?.module,
        parentId,
      };
      mutate(obj);
    };

    const onTitleUpdate = useCallback(
      (title) => {
        onUpdateCall({ title });
      },
      [taskInfo]
    );

    const onAssigneeUpdate = useCallback(
      ({ teamData, teamIds }) => {
        let data = {
          assignees: teamIds,
          assigneeData: teamData,
          assigneeUpdate: true,
        };
        onUpdateCall(data);
      },
      [taskInfo]
    );

    const onDueDateUpdate = useCallback(
      (dueDate) => {
        onUpdateCall({ dueDate });
      },
      [taskInfo]
    );

    const onPlatformUpdate = useCallback(
      (platforms) => {
        onUpdateCall({ platforms });
      },
      [taskInfo]
    );

    // SideBar Code
    const [isToggle, setIsToggle] = useState(false);
    const sideBarToggle = useCallback(() => {
      setIsToggle(!isToggle);
    }, [isToggle]);
    const [isSubtaskToggle, setIsSubtaskToggle] = useState(
      !!taskInfo?.childTasks?.length
    );

    const isModuleSelected = useSelector(
      (state) => state.userReducer?.isModuleSelected
    );
    return (
      <li
        // className={parentId && isLastIndex ? "pb-5" : ""}
        // style={{
        //   border: parentId && "none",

        //   // borderBottomLeftRadius: 13,
        // }}

        style={{
          borderBottomLeftRadius: !isTaskLastIndex ? 0 : 13,
          border: parentId && "none",
        }}
      >
        <div
          className={parentId ? "abc" : ""}
          ref={provided?.innerRef}
          {...provided?.draggableProps}
          {...provided?.dragHandleProps}
          style={{ ...getStyle(provided, style) }}
        >
          <div
            style={{
              backgroundColor: taskInfo?.disabled
                ? "rgba(255,255,255 , 0.1)"
                : null,
            }}
            className={`tableRowModuleHeader ${
              // !!!platformsList?.length && "tableRowModuleHeader_withoutPlatform"
              ""
            }  ${actionDisabled && "tableRowModuleHeader_withoutCheckBox"}`}
            onClick={(e) => {
              if (taskInfo?.disabled) {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          >
            <div className="row_starter"></div>
            {!actionDisabled && (
              <div className="border_divider">
                <Checkbox
                  size="small"
                  checked={
                    parentId
                      ? !!isSubTaskSelected?.[parentId]?.includes(taskInfo?._id)
                      : isSelected.includes(taskInfo?._id)
                  }
                  onClick={() =>
                    (!actionDisabled || taskInfo?.disabled ? true : false) &&
                    onSelectTask(taskInfo?._id)
                  }
                  // onClick={() => multiSelection(row?._id, milestoneId)}
                  disabled={
                    actionDisabled ||
                    taskInfo?.disabled ||
                    isModuleSelected?.length ||
                    (Object.keys(isSubTaskSelected).length && !parentId)
                      ? true
                      : false
                  }
                />
              </div>
            )}
            <div className="border_divider tableRowModuleNew">
              {!parentId && !isSelected?.length && (
                <div onClick={() => setIsSubtaskToggle((prev) => !prev)}>
                  <div
                    className={`alignCenter arrowContainer ${
                      !isSubtaskToggle ? "arrowContainer_90degree" : ""
                    }`}
                  >
                    <ArrowRightIcon />
                  </div>
                </div>
              )}
              <InputTextClickAway
                value={taskInfo?.title}
                type="text"
                onChange={onTitleUpdate}
                disabled={actionDisabled || taskInfo?.disabled ? true : false}
                className="textEllipse mr-2"
                containerStyle={{
                  width: 0,
                }}
                textClassName={
                  !parentId ? "textEllipse " : "textEllipse subtask_text"
                }
              />

              <div
                // style={{ width: 50 }}
                className="alignCenter justifyContent_center cursorPointer"
                onClick={sideBarToggle}
              >
                {!!taskInfo?.childTasks?.length ? (
                  <LightTooltip title="Total Subtask" arrow>
                    <div
                      className="mr-1 subTaskTotal_container"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsSubtaskToggle((prev) => !prev);
                      }}
                    >
                      {taskInfo?.childTasks?.length}
                    </div>
                  </LightTooltip>
                ) : null}

                {taskInfo?.description && (
                  <LightTooltip title="Description" arrow>
                    <div className="alignCenter justifyContent_center cursorPointer mr-1">
                      <Icon name="menu" />
                    </div>
                  </LightTooltip>
                )}
                {taskInfo?.bugCount?.totalOpen > 0 && (
                  <LightTooltip title="Bugs Open" arrow>
                    <div
                      style={{
                        marginRight: 10,
                        fontSize: 13,
                        fontFamily: "Lato-Bold",
                      }}
                    >
                      <span style={{ fontSize: 19 }}>
                        {taskInfo?.bugCount?.totalOpen}
                      </span>
                      <span>/</span>
                      <span style={{ fontFamily: "Lato-Italic" }}>
                        {taskInfo?.bugCount?.total}
                      </span>{" "}
                    </div>
                  </LightTooltip>
                )}
                <LightTooltip title="Task Info" arrow>
                  <div className="alignCenter justifyContent_center cursorPointer mr-1">
                    <Icon name="info" />
                  </div>
                </LightTooltip>
              </div>
            </div>
            <div className="border_divider">
              <AssigneeSelection
                assignee={taskInfo?.assignees}
                multiple
                team={teamList}
                onChange={onAssigneeUpdate}
                disabled={actionDisabled}
                contentCenter
                taskInfo={taskInfo}
              />
            </div>
            <div className="border_divider">
              <DueDateProgress
                onChange={onDueDateUpdate}
                dueDate={taskInfo?.dueDate}
                status={taskInfo?.status}
                disabled={actionDisabled}
                removeButton
              />
            </div>
            <div className="border_divider">
              <TaskStatus
                info={taskInfo}
                className="borderRight"
                orgId={orgId}
                parentId={parentId}
                // disabled={individualStatusUpdatePermission ? false : actionDisabled}
                disabled={
                  !actionDisabled
                    ? false
                    : individualStatusUpdatePermission
                    ? false
                    : ["InProgress", "Active", "NotStarted"].includes(
                        taskInfo?.status
                      )
                }
                taskStatusPermission={actionDisabled}
                individualStatusUpdatePermission={
                  individualStatusUpdatePermission
                }
              />
            </div>
            {!!platformsList?.length ? (
              <div className="border_divider">
                <CustomMenu
                  activeMenuItem={taskInfo?.platforms}
                  disabled={actionDisabled}
                  className="borderRight"
                  menuItems={platformsList}
                  handleMenuClick={onPlatformUpdate}
                  multiple
                />
              </div>
            ) : (
              <div className="border_divider">
                <CustomAvatar
                  src={taskInfo?.createdBy?.[0]?.profilePicture}
                  title={taskInfo?.createdBy?.[0]?.name}
                  small
                  borderColor={"#3d4368"}
                  withBorder={1}
                />
              </div>
            )}
          </div>

          {!isDragging &&
            isSubtaskToggle &&
            !disabledSubTask &&
            !isSelected?.length &&
            !isModuleSelected?.length && (
              // <li className="pb-5" style={{ border: "none" }}>
              <SubTaskList
                orgId={orgId}
                milestoneId={taskInfo?.milestone}
                projectId={taskInfo?.project}
                taskId={taskInfo?._id}
                teamList={teamList}
                actionDisabled={actionDisabled}
                platforms={platforms}
                isTaskLastIndex={isTaskLastIndex}
                moduleId={taskInfo?.module}
              />
            )}

          {
            //   <div
            //   className="tableRowModule"
            //   style={{
            //     background: taskInfo?.disabled ? "rgba(255,255,255,0.1)" : "",
            //     opacity: taskInfo?.disabled ? 0.6 : 1,
            //     cursor:
            //       taskInfo?.disabled || actionDisabled ? "default" : "pointer",
            //     // platformsList?.length
            //     gridTemplateColumns: !!platforms?.length
            //       ? `4fr 1fr 1fr 1fr 1fr`
            //       : `4fr 1fr 1fr 1fr`,
            //     marginRight: !!platforms?.length ? 0 : 1,
            //   }}
            // >
            //   {/* Title */}
            //   <div className="d_flex ">
            //     <div className="firstEmptyCell" />
            //     <div
            //       className={`
            //       ${
            //         (
            //           Object.keys(isSubTaskSelected).length
            //             ? false
            //             : !actionDisabled || taskInfo?.disabled
            //             ? true
            //             : false
            //         )
            //           ? "sideLine"
            //           : "sideLineNoHover"
            //       }
            //       ${
            //         isSelected.length ||
            //         // isSubTaskSelected?.[parentId]?.includes(taskInfo?._id)
            //         (Object.keys(isSubTaskSelected).length && parentId)
            //           ? `sideLineSelected`
            //           : ""
            //       }`}
            // onClick={() =>
            //   (!actionDisabled || taskInfo?.disabled ? true : false) &&
            //   onSelectTask(taskInfo?._id)
            // }
            //     >
            // <Checkbox
            //   size="small"
            //   checked={
            //     parentId
            //       ? !!isSubTaskSelected?.[parentId]?.includes(taskInfo?._id)
            //       : isSelected.includes(taskInfo?._id)
            //   }
            //   // onClick={() => multiSelection(row?._id, milestoneId)}
            //   disabled={actionDisabled || taskInfo?.disabled ? true : false}
            // />
            //     </div>
            //     <div className="rowContainer flex borderRight">
            // {!parentId && !isSelected?.length && (
            //   <div onClick={() => setIsSubtaskToggle((prev) => !prev)}>
            //     <div
            //       className={`alignCenter arrowContainer ${
            //         !isSubtaskToggle ? "arrowContainer_90degree" : ""
            //       }`}
            //     >
            //       <ArrowRightIcon />
            //     </div>
            //   </div>
            // )}
            //       <div className="d_flex flex">
            // <InputTextClickAway
            //   value={taskInfo?.title}
            //   type="text"
            //   onChange={onTitleUpdate}
            //   disabled={
            //     actionDisabled || taskInfo?.disabled ? true : false
            //   }
            //   className="textEllipse mr-2"
            //   containerStyle={{
            //     width: 0,
            //   }}
            //   textClassName={"textEllipse"}
            // />
            //       </div>
            //       <div
            //         // style={{ width: 50 }}
            //         className="alignCenter justifyContent_center cursorPointer"
            //         onClick={sideBarToggle}
            //       >
            //         {taskInfo?.description && (
            //           <LightTooltip title="Description" arrow>
            //             <div className="alignCenter justifyContent_center cursorPointer mr-1">
            //               <Icon name="menu" />
            //             </div>
            //           </LightTooltip>
            //         )}
            //         {taskInfo?.bugCount?.totalOpen > 0 && (
            //           <LightTooltip title="Bugs Open" arrow>
            //             <div
            //               style={{
            //                 marginRight: 10,
            //                 fontSize: 13,
            //                 fontFamily: "Lato-Bold",
            //               }}
            //             >
            //               <span style={{ fontSize: 19 }}>
            //                 {taskInfo?.bugCount?.totalOpen}
            //               </span>
            //               <span>/</span>
            //               <span style={{ fontFamily: "Lato-Italic" }}>
            //                 {taskInfo?.bugCount?.total}
            //               </span>{" "}
            //             </div>
            //           </LightTooltip>
            //         )}
            //         <LightTooltip title="Task Info" arrow>
            //           <div className="alignCenter justifyContent_center cursorPointer mr-1">
            //             <Icon name="info" />
            //           </div>
            //         </LightTooltip>
            //       </div>
            //     </div>
            //   </div>
            //   {/* Assignee */}
            //   <div className="alignCenter justifyContent_center borderRight">
            // <AssigneeSelection
            //   assignee={taskInfo?.assignees}
            //   multiple
            //   team={teamList}
            //   onChange={onAssigneeUpdate}
            //   disabled={actionDisabled}
            //   contentCenter
            //   taskInfo={taskInfo}
            // />
            //   </div>
            //   {/* Due Date */}
            //   <div className="alignCenter justifyContent_center borderRight">
            // <DueDateProgress
            //   onChange={onDueDateUpdate}
            //   dueDate={taskInfo?.dueDate}
            //   status={taskInfo?.status}
            //   disabled={actionDisabled}
            //   removeButton
            // />
            //   </div>
            //   {/* Status */}
            // <TaskStatus
            //   info={taskInfo}
            //   className="borderRight"
            //   orgId={orgId}
            //   parentId={parentId}
            //   // disabled={individualStatusUpdatePermission ? false : actionDisabled}
            //   disabled={
            //     !actionDisabled
            //       ? false
            //       : individualStatusUpdatePermission
            //       ? false
            //       : ["InProgress", "Active", "NotStarted"].includes(
            //           taskInfo?.status
            //         )
            //   }
            //   taskStatusPermission={actionDisabled}
            //   individualStatusUpdatePermission={
            //     individualStatusUpdatePermission
            //   }
            // />
            //   {/* Platform */}
            //   {!!platformsList?.length && (
            // <CustomMenu
            //   activeMenuItem={taskInfo?.platforms}
            //   disabled={actionDisabled}
            //   className="borderRight"
            //   menuItems={platformsList}
            //   handleMenuClick={onPlatformUpdate}
            //   multiple
            // />
            //   )}
            // </div>
          }

          <CustomSideBar show={isToggle} toggle={sideBarToggle}>
            <SubTaskInfoSidebar
              taskInfo={taskInfo}
              orgId={orgId}
              disabled={actionDisabled}
              parentId={parentId}
            />
          </CustomSideBar>
          {/* {!isDragging &&
            isSubtaskToggle &&
            !disabledSubTask &&
            !isSelected?.length && (
              <SubTaskList
                orgId={orgId}
                milestoneId={taskInfo?.milestone}
                projectId={taskInfo?.project}
                taskId={taskInfo?._id}
                teamList={teamList}
                actionDisabled={actionDisabled}
                platforms={platforms}
              />
            )} */}
        </div>
      </li>
    );
  }
);

export default memo(TaskRowItem);

function getStyle(provided, style) {
  if (!provided) {
    return {};
  }
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    outline: "none",
    ...provided.draggableProps.style,
    ...style,
  };
}
