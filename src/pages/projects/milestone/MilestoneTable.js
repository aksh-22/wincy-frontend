import React, { useState, memo } from "react";
import "css/Milestone.css";
import Checkbox from "@material-ui/core/Checkbox";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import { ClickAwayListener } from "@material-ui/core";
import { useUpdateMilestone } from "react-query/milestones/useUpdateMilestone";
import { useTasks } from "react-query/milestones/task/useTasks";
import { useAddTask } from "react-query/milestones/task/useAddTask";
import CustomMenu from "components/CustomMenu";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import { useUpdateTask } from "react-query/milestones/task/useUpdateTask";
import { infoToast } from "utils/toast";
import MilestoneInfoSidebar from "./MilestoneInfoSidebar";
import SubTaskInfoSidebar from "./SubTaskInfoSidebar";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import classes from "./MileStone.module.css";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";

import { useSelector } from "react-redux";
import CustomCircularProgressBar from "components/CustomCircularProgressBar";
import { LightTooltip } from "components/tooltip/LightTooltip";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import moment from "moment";

import CheckCircleRoundedIcon from "@material-ui/icons/CheckCircleRounded";
import { capitalizeFirstLetter, textTruncateMore } from "utils/textTruncate";
import { useCallback } from "react";
import InfoIcon from "components/icons/InfoIcon";
import { appendCountOnString } from "utils/appendCountOnString";

import ErrorIcon from "@material-ui/icons/Error";
import { useMemo } from "react";
import CustomDatePicker from "components/customDatePicker/CustomDatePicker";
const status = [
  { label: "Not Started", value: "NotStarted" },
  { label: "Completed", value: "Completed" },
  { label: "Active", value: "Active" },
];

const checkUserAuth = (bug, userId, userType, team) => {
  let assignee = true;
  if (bug === undefined) {
    assignee = true;
  } else {
    assignee =
      bug?.assignees?.filter((item) => item?._id === userId)?.length > 0
        ? true
        : false;
  }

  let createdBy = Array.isArray(bug?.createdBy)
    ? bug?.createdBy?.[0]?._id === userId
    : bug?.createdBy?._id === userId;
  let adminAccess = ["Admin", "Member++"].includes(userType);
  let isProjectManager =
    team?.filter((item) => item?._id === userId && item?.projectHead === true)
      ?.length > 0;

  return assignee || createdBy || adminAccess || isProjectManager
    ? false
    : true;
};

let checkAddAuth = (userId, userType, team) => {
  let adminAccess = ["Admin", "Member++"].includes(userType);
  let isProjectManager =
    team?.filter((item) => item?._id === userId && item?.projectHead === true)
      ?.length > 0;

  return adminAccess || isProjectManager ? true : false;
};

const MilestoneTable = memo(
  ({
    item,
    loading,
    editRowId,
    handleRowEditing,
    orgId,
    projectId,
    platforms,
    isSelected = [],
    multiSelection,
    milestoneId,
    filter,
    team,
    disabled,
  }) => {
    // const [currentMilestone, setCurrentMilestone] = useState({});
    const [collapsible, setCollapsible] = useState(
      item?._id === "localData" ? false : true
    );
    // const [currentIndex, setCurrentIndex] = useState([]);
    const [milestoneName, setMilestoneName] = useState("");
    const [milestoneInfo, setMilestoneInfo] = useState("");
    const [taskInfo, setTaskInfo] = useState("");
    const [taskWillAdd, setTaskWillAdd] = useState(false);
    const [addTaskName, setAddTaskName] = useState("");
    // const [taskStatus, setTaskStatus] = useState("Not Completed");
    // const [priority, setPriority] = useState("Low");
    // const [currentTaskId, setCurrentTaskId] = useState(null);
    const [editTaskRowId, setEditTaskRowId] = useState(null);
    const [editMileStoneName, setEditMileStoneName] = useState(false);
    const [editTaskName, setEditTaskName] = useState("");
    const { mutate } = useUpdateMilestone(handleRowEditing);
    const { isLoading: tasksLoading, data: taskData } = useTasks(
      orgId,
      item?._id
    );

    const userType = useSelector((state) => state.userReducer?.userType);

    const { mutate: mutateAddTask } = useAddTask(setTaskWillAdd);
    const { mutate: mutateUpdateTask } = useUpdateTask(undefined, projectId);

    // console.log({team})
    const onSubmitTask = async () => {
      if (!addTaskName) {
        setTaskWillAdd(true);
        infoToast("Please enter task name!");
      } else {
        let result = await appendCountOnString(
          taskData?.tasks,
          addTaskName,
          0,
          addTaskName
        );
        let data = {
          milestoneId: item?._id,
          orgId: orgId,
          projectId: projectId,
          data: {
            title: result,
          },
        };
        mutateAddTask(data);
        setAddTaskName("");
      }
    };

    const heightCalculate = (length) => {
      if (tasksLoading) {
        return 2 * 40 + 150;
      }
      return "auto";
      // return (length ?? 0) * 40 + 100;
    };

    const handleUpdateMilestone = (id, oldValue) => {
      if (milestoneName === oldValue) {
        return setEditMileStoneName(false);
      }
      if (milestoneName) {
        let data = {
          title: milestoneName,
        };

        let sendData = {
          orgId,
          projectId,
          milestoneId: id,
          data,
        };
        mutate(sendData);
        setEditMileStoneName(false);
      } else {
        // infoToast("Milestone name can't be empty!");
        setEditMileStoneName(false);
      }
    };

    const handleStatus = useCallback((status, id) => {
      let data = { status: status.value };

      status?.value &&
        mutateUpdateTask({
          taskId: id,
          data: data,
          orgId: orgId,
          milestoneId: item?._id,
          projectId,
        });
    }, []);
    // const handlePriority = (id) => (priority) => {
    //   let data = { priority: priority.value };

    //   mutateUpdateTask({
    //     taskId: id,
    //     data: data,
    //     orgId: orgId,
    //     milestoneId: currentMilestoneId,
    //   });
    // };

    const handlePlatform = useCallback((platform, id) => {
      let data = { platforms: platform };

      platform.length > 0 &&
        mutateUpdateTask({
          taskId: id,
          data: data,
          orgId: orgId,
          milestoneId: item?._id,
          projectId,
        });
    }, []);

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

    const handleUpdateTaskName = (id, oldValue) => {
      if (editTaskName) {
        let data = { title: editTaskName };
        if (editTaskName === oldValue || editTaskName?.trim()?.length === 0) {
          return setEditTaskRowId(null);
        }
        mutateUpdateTask({
          taskId: id,
          data: data,
          orgId: orgId,
          milestoneId: item?._id,
          setEditTaskRowId,
          projectId,
        });
      } else {
        setEditTaskRowId(null);
      }
    };

    const handleAssigneeUpdate = useCallback(({ assigneeData, otherId }) => {
      let teamIds = [];
      let teamData = [];
      assigneeData?.map((item) => {
        teamIds.push(item?._id);
        teamData?.push(item);
        return null;
      });
      mutateUpdateTask({
        taskId: otherId,
        data: {
          assignees: teamIds ?? "",
        },
        orgId: orgId,
        milestoneId: item?._id,
        assignee: true,
        assigneeData: teamData,
        projectId,
      });
    }, []);

    // const [datePicker, setDatePicker] = useState(false)

    const taskTable = (row, i) => {
      return (
        <div
          key={row?._id}
          className={`${classes.tableRow2}  ${
            row?.status === "Completed" ? "completedRow " : ""
          }`}
          style={{ opacity: row?._id === "localData" ? 0.3 : 1 }}
        >
          <div
            className={`${
              disabled
                ? classes.subMilestone_sideLine_noHover
                : classes.subMilestone_sideLine
            } d_flex alignCenter ${
              isSelected.length !== 0 ? `${classes.rowSelected}` : ""
            }  ${editTaskRowId === row?._id ? "backgroundChangeOnEdit" : ""}
          ${row?.status === "Completed" ? "completedRowSideLine" : ""}
          `}
          >
            <Checkbox
              size="small"
              checked={isSelected.includes(row?._id)}
              onClick={() => multiSelection(row?._id, milestoneId)}
              disabled={disabled || row?._id === "localData" ? true : false}
            />
          </div>

          <div className={`subMilestone_title alignCenter d_flex `}>
            {editTaskRowId === row?._id ? (
              <ClickAwayListener
                onClickAway={(e) => handleUpdateTaskName(row?._id, row?.title)}
              >
                <input
                  type="text"
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: "100%" }}
                  onKeyPress={(e) =>
                    e.key === "Enter" &&
                    handleUpdateTaskName(row?._id, row?.title)
                  }
                  defaultValue={row?.title}
                  autoFocus
                  onChange={(e) => setEditTaskName(e.target.value)}
                  className=" px-2"
                  maxLength={150}
                />
              </ClickAwayListener>
            ) : (
              <p
                onClick={() => {
                  row?._id !== "localData" &&
                    !disabled &&
                    setEditTaskRowId(row?._id);
                }}
                className={`cursorText  px-2 textEllipse ${
                  row?.status === "Completed" ? " lineThrough" : ""
                }`}
              >
                {capitalizeFirstLetter(row?.title)}
              </p>
            )}
          </div>

          <div className="d_flex alignCenter justifyContent_end">
            <InfoIcon
              onClick={() => row?.id !== "localData" && setTaskInfo(i)}
            />
          </div>
          <div
            className="d_flex alignCenter "
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <AssigneeSelection
              assignee={row?.assignees}
              team={team}
              onChange={handleAssigneeUpdate}
              otherId={row?._id}
              disabled={disabled}
              multiple
              // maxLength={2}
            />
            {/* <CustomPopper
            disabled={
              !["Admin", "Member++", "Member+"].includes(userType?.userType)
            }
            value={
              <CustomAvatar
                small
                src={row?.assignee?.profilePicture}
                title={row?.assignee?.name ?? "No Assignee"}
              />
            }
            content={
              <BugAssignees
                orgId={orgId}
                bugId={row?._id}
                projectInfo={projectInfo}
                currentAssignee={row?.assignee}
                type="subTask"
                currentMilestoneId={currentMilestoneId}
                // pageNo={pageNo}
                // platform={activeBug?.id}
              />
            }
            noHover={true}
          /> */}
          </div>

          <div
            className={`subMilestone_priority milestone_cell border_solid_bottom border_solid_left`}
          >
            <RenderDate
              dueDate={row?.dueDate}
              completedOn={row?.completedOn}
              status={row?.status}
              id={row?._id}
              orgId={orgId}
              currentMilestoneId={item?._id}
              projectId={projectId}
              disabled={disabled}
            />
            {/* <CustomPopper 
           value={ <RenderDate
            dueDate={row?.dueDate}
             completedOn={row?.completedOn}
             status={row?.status}
            />}
            content={
              <CustomDatePicker 
              directPicker
              open={true}
              />
            }
           /> */}
            {/* {renderDate(row?.dueDate, row?.completedOn, row?.status)} */}
            {/* <CustomMenu
              menuItems={[
                { label: "Low", value: "Low" },
                { label: "Medium", value: "Medium" },
                { label: "High", value: "High" },
              ]}
              id={row?._id}
              handleMenuClick={
                row?.id !== "localData" && handlePriority(row?._id)
              }
              activeMenuItem={row?.priority}
              disabled={disabled}
            /> */}
          </div>

          <div
            className={`subMilestone_assignee milestone_cell border_solid_bottom border_solid_left`}
          >
            <CustomMenu
              menuItems={status}
              id={row?._id}
              handleMenuClick={handleStatus}
              activeMenuItem={addSpaceUpperCase(row?.status)}
              disabled={checkUserAuth(
                row,
                userType?.userId,
                userType?.userType,
                team
              )}
              // disabled={
              //   !(
              //     userType?.userId !==
              //     (Array.isArray(row?.assignee)
              //       ? row?.assignee?.[0]?._id
              //       : row?.assignee?._id)
              //   ) || ["Admin", "Member++"].includes(userType?.userType)
              //     ? false
              //     : true
              // }
            />
          </div>
          <div
            style={{
              // backgroundColor: 'green',
              cursor: "pointer ",
            }}
            className={`subMilestone_platform milestone_cell border_solid_bottom border_solid_left`}
          >
            <CustomMenu
              menuItems={platformsList}
              id={row?._id}
              handleMenuClick={handlePlatform}
              activeMenuItem={row?.platforms ?? []}
              disabled={disabled}
              multiple
            />
          </div>
        </div>
      );
    };

    const onFilterApply = (taskData) => {
      const { taskIds, assigneeIds, status, priority, platforms } = filter;
      return assigneeIds?.length ||
        taskIds?.length ||
        platforms?.length ||
        status?.length ||
        priority?.length
        ? taskData?.tasks?.map(
            (row, i) =>
              // test
              // (filter?.assigneeIds?.includes(row?.assignees?._id) ||
              (row?.assignees?.filter((item) =>
                filter?.assigneeIds?.includes(item?._id)
              ).length > 0 ||
                priority?.includes(row?.priority) ||
                status?.includes(row?.status) ||
                row?.platforms?.filter((item) => platforms?.includes(item))
                  .length > 0) &&
              // platforms?.includes(row?.platform)
              taskTable(row, i)
          )
        : taskData?.tasks?.map((row, i) => taskTable(row, i));
    };

    const getMilestoneCompletionPercentage = () => {
      let percentage =
        (parseInt(item?.taskCount?.Completed ?? 0) /
          (parseInt(item?.taskCount?.NotStarted ?? 0) +
            parseInt(item?.taskCount?.Completed ?? 0) +
            parseInt(item?.taskCount?.Active ?? 0))) *
        100;

      return isNaN(percentage) ? 0 : percentage;
    };
    return (
      <>
        <div
          className={`milestoneContainer mb-5 ${item?._id}`}
          key={item?._id}
          style={{
            height: collapsible ? heightCalculate(taskData?.tasks?.length) : 50,
          }}
        >
          {/* Header Div */}
          <div
            // className="d_flex alignCenter milestone rowHeader"
            className={`${classes.tableRow} alignCenter milestone rowHeader`}
            onClick={(event) => {
              // event.preventDefault();
              // event.stopPropagation();
              // item?._id !== "localData" &&
              //   insertRow_id(item?._id);
              setCollapsible(!collapsible);
            }}
            style={{
              position: "sticky",
              top: 68,
              opacity: item?._id === "localData" ? 0.3 : 1,
              backgroundColor: collapsible === true ? "#343760" : "transparent",
              zIndex: 2,
            }}
          >
            <div className={`arrowContainer`}>
              <ArrowRightIcon
                className={`milestone_arrowContainer ${
                  collapsible ? "milestone_arrowContainer_90degree" : ""
                }`}
                style={{ color: "var(--defaultWhite)" }}
              />
            </div>

            <div
              className="d_flex alignCenter px-2 ff_Lato_Bold"
              style={{ flex: 1, height: "100%" }}
            >
              {!editMileStoneName ? (
                <div
                  onClick={(e) => {
                    // e.stopPropagation()
                    if (!disabled) {
                      if (item?._id !== "localData") {
                        // handleRowEditing(e, item?._id);
                        setEditMileStoneName(true);
                        setMilestoneName(item?.title);
                      }
                    }
                  }}
                  className="milestoneTitleEllipse cursorText"
                >
                  <LightTooltip
                    title={item?.title?.length > 25 ? item?.title : ""}
                  >
                    <p className="ff_Lato_Bold">
                      {textTruncateMore(item?.title, 25)}
                    </p>
                  </LightTooltip>
                </div>
              ) : (
                <ClickAwayListener
                  onClickAway={(e) =>
                    handleUpdateMilestone(item?._id, item?.title)
                  }
                >
                  <input
                    style={{ paddingLeft: 5 }}
                    type="text"
                    onClick={(e) => e.stopPropagation()}
                    onKeyPress={async (e) => {
                      e.key === "Enter" &&
                        handleUpdateMilestone(item?._id, item?.title);
                    }}
                    defaultValue={milestoneName}
                    autoFocus
                    onKeyUp={(e) => setMilestoneName(e.target.value)}
                    maxLength={150}
                  />
                </ClickAwayListener>
              )}
            </div>
            <div className={classes.extraEl}>
              {/* {item?.dueDate && (
                <div style={{ height: 20, display: "flex", width: 100 }}>
                  <CustomCircularProgressBar
                    percentage={getMilestoneCompletionPercentage().toFixed()}
                  />
                  <p style={{ width: "100%" }}>
                    {moment(item?.dueDate).format("DD MMM")}
                  </p>
                </div>
              )} */}
              <LightTooltip
                title={`${getMilestoneCompletionPercentage().toFixed()}%`}
              >
                <div style={{ width: 25, height: 20 }}>
                  <CustomCircularProgressBar
                    percentage={getMilestoneCompletionPercentage().toFixed()}
                  />
                </div>
              </LightTooltip>
              <InfoIcon
                onClick={(event) => {
                  if (item?._id !== "localData") {
                    event.preventDefault();
                    event.stopPropagation();
                    setMilestoneInfo(item);
                  }
                }}
              />
            </div>
            <div className="milestone_cell ff_Lato_Bold">Assignee</div>
            <div className="milestone_cell ff_Lato_Bold">Due Date</div>
            <div className="milestone_cell ff_Lato_Bold">Status</div>
            <div className="milestone_cell ff_Lato_Bold">Platform</div>
          </div>

          {/* Sub Header Div NEW Add */}
          <div
            className={`milestone_subContainer normalFont ${
              collapsible ? "activeABC" : ""
            }`}
          >
            {collapsible &&
              (loading ? (
                "Loading"
              ) : (
                <>
                  {checkAddAuth(userType?.userId, userType?.userType, team) && (
                    <div
                      className={`d_flex  add_width ${"decrease_width"} ${
                        classes.addRow
                      } ${taskWillAdd ? "addBorder" : ""}`}
                      style={{
                        // borderColor: false ? '#4074EA' : '#343760',
                        // backgroundColor: '#1A1C34',
                        position: "sticky",
                        top: 105,
                        zIndex: 1,
                        height: 35,
                        borderBottom: "1px solid var(--divider)",
                        borderTop: "1px solid var(--divider)",
                      }}
                    >
                      <div
                        className={`${
                          classes.subMilestone_sideLine_noHover
                        } d_flex alignCenter  ${
                          taskWillAdd ? "rowSideBarBg" : ""
                        }`}
                      >
                        {/* <Checkbox size="small" /> */}
                      </div>

                      <div
                        style={{
                          backgroundColor: "var(--milestoneRowAddColor)",
                          display: "flex",
                          flex: 1,
                        }}
                      >
                        <div className="alignCenter d_flex flex">
                          {taskWillAdd ? (
                            <ClickAwayListener
                              onClickAway={() => setTaskWillAdd(false)}
                            >
                              <div className="alignCenter d_flex flex">
                                <input
                                  type="text"
                                  name="title"
                                  // className="sm-transparent-input"
                                  style={{ flex: 1 }}
                                  className="milestone_input_text px-2"
                                  placeholder="+ Add"
                                  autoFocus
                                  maxLength="70"
                                  autocomplete="off"
                                  // value={addTaskData.title}
                                  // onChange={(e) => setAddTaskName(e.target.value)}
                                  onKeyUp={(e) =>
                                    setAddTaskName(e.target.value)
                                  }
                                  // ref={this.addInput}
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      onSubmitTask();
                                      e.target.value = "";
                                    }
                                  }}
                                />
                              </div>
                            </ClickAwayListener>
                          ) : (
                            <div
                              className="pl-2 cursorText"
                              onClick={() => setTaskWillAdd(true)}
                              style={{ width: "100%" }}
                            >
                              + Add
                            </div>
                          )}
                          <div
                            className={`addButton_milestone cursorPointer ${
                              taskWillAdd
                                ? "addButton_milestone_add_width"
                                : "false"
                            }`}
                            style={{ height: "100%" }}
                            onClick={() => onSubmitTask()}
                          >
                            Add
                          </div>
                        </div>
                        <div
                          className={`addButton_milestone ${
                            false ? "addButton_milestone_add_width" : "false"
                          }
                            `}
                        >
                          Add
                        </div>
                      </div>
                    </div>
                  )}

                  {tasksLoading && <TableRowSkeleton count={2} height={35} />}
                  {onFilterApply(taskData)}
                </>
              ))}
            <CustomSideBar
              show={taskData?.tasks[taskInfo] ? true : false}
              toggle={() => setTaskInfo("")}
            >
              <SubTaskInfoSidebar
                taskInfo={taskData?.tasks[taskInfo]}
                index={taskInfo}
                orgId={orgId}
                userType={userType}
                disabled={disabled}
                projectId={projectId}
                milestoneId={item?._id}
              />
            </CustomSideBar>
          </div>
        </div>

        {
          <CustomSideBar
            show={milestoneInfo ? true : false}
            toggle={() => setMilestoneInfo("")}
          >
            <MilestoneInfoSidebar
              orgId={orgId}
              projectId={projectId}
              milestoneId={milestoneInfo?._id}
              disabled={disabled}
            />
          </CustomSideBar>
        }
      </>
    );
  }
);

export default MilestoneTable;

const RenderDate = memo(
  ({
    dueDate,
    completedOn,
    status,
    projectId,
    id,
    orgId,
    currentMilestoneId,
    disabled,
    ...props
  }) => {
    const { mutate: mutateUpdateTask } = useUpdateTask(undefined, projectId);

    const returnDateToolTip = (dueDate, overdue) => {
      if (overdue) {
        return `${Math.abs(moment(dueDate).diff(new Date(), "days"))} ${
          Math.abs(moment(dueDate).diff(new Date(), "days")) === 1
            ? "day"
            : "days"
        } Overdue`;
      }
      if (
        moment(dueDate).format("DD-MM-YYYY") ===
        moment(new Date()).format("DD-MM-YYYY")
      ) {
        return "Today";
      }

      return `${
        Math.abs(moment(dueDate).diff(new Date(), "days")) + 1
      } days left`;
    };

    const renderToopTipOnCompleteion = (dueDate, completedOn, newDate) => {
      if (
        moment(dueDate).format("DD-MM-YYYY") ===
        moment(completedOn).format("DD-MM-YYYY")
      ) {
        return "Completed on Time";
      }

      if (moment(dueDate).diff(completedOn, "days") >= 0) {
        return "Completed on Time";
      }

      if (moment(dueDate).diff(completedOn, "days") <= 0) {
        return `${Math.abs(moment(dueDate).diff(completedOn, "days"))} ${
          Math.abs(moment(dueDate).diff(completedOn, "days")) === 1
            ? "day"
            : "days"
        } delayed`;
      }
    };

    const renderPercentageDueDate = (dueDate) => {
      if (
        moment(dueDate).format("DD-MM-YYYY") ===
        moment(new Date()).format("DD-MM-YYYY")
      ) {
        return 100;
      }
      if (Math.abs(moment(dueDate).diff(new Date(), "days")) + 1 > 7) {
        return 0;
      }
      return Math.abs(
        ((Math.abs(moment(dueDate).diff(new Date(), "days")) + 1) / 7) * 100 -
          100
      );
    };

    const dateChanger = (value) => {
      let data = { dueDate: value };
      mutateUpdateTask({
        taskId: id,
        data: data,
        orgId: orgId,
        milestoneId: currentMilestoneId,
        projectId,
      });
    };
    return (
      <CustomDatePicker
        // minDate={new Date()}
        onChange={dateChanger}
        defaultValue={dueDate}
        disabled={disabled}
      >
        {dueDate ? (
          <div className="d_flex alignCenter" style={{ fontSize: 13 }}>
            {(status === "Active" || status === "NotStarted") && (
              <LightTooltip
                arrow
                title={returnDateToolTip(
                  dueDate,
                  moment(dueDate).diff(new Date(), "days") < 0
                )}
              >
                <div
                  className={`${
                    moment(dueDate).diff(new Date(), "days") < 0
                      ? "d_flex alignCenter"
                      : ""
                  }`}
                >
                  {moment(dueDate).diff(new Date(), "days") < 0 ? (
                    <ErrorIcon
                      // className="blink"
                      style={{ color: "var(--red)", fontSize: 18 }}
                    />
                  ) : (
                    <div style={{ height: 18, width: 18 }}>
                      <CustomCircularProgressBar
                        strokeLinecap="butt"
                        percentage={renderPercentageDueDate(dueDate)}
                        strokeWidth={50}
                        percentageDisable
                      />
                      &nbsp;
                    </div>
                  )}
                </div>
              </LightTooltip>
            )}
            {status === "Completed" && (
              <LightTooltip
                arrow
                title={renderToopTipOnCompleteion(
                  dueDate,
                  completedOn,
                  new Date()
                )}
              >
                <CheckCircleRoundedIcon
                  style={{
                    color: "var(--red)",
                    fontSize: 18,
                    color: "rgb(44, 222, 86)",
                  }}
                />
              </LightTooltip>
            )}
            &nbsp;&nbsp;{" "}
            <div
              className={`${
                moment(dueDate).diff(new Date(), "days") < 0 ? "" : "pt-05"
              }`}
            >
              {moment(dueDate).format("MMM DD")}
            </div>{" "}
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex" }} />
        )}
      </CustomDatePicker>
    );
  }
);
