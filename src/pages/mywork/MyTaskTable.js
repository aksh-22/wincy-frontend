import React, { useState } from "react";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import "css/Milestone.css";
import Checkbox from "@material-ui/core/Checkbox";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import CustomMenu from "components/CustomMenu";
import {
  ClickAwayListener,
  FormControl,
  IconButton,
  makeStyles,
  MenuItem,
} from "@material-ui/core";
import { useMyWorkProjects } from "react-query/mywork/useMyWorkProjects";
import { useSelector } from "react-redux";
import { useProjectTasks } from "react-query/mywork/useProjectTasks";
import { useEffect } from "react";
import CustomChip from "components/CustomChip";
import moment from "moment";
import CommonDialog from "components/CommonDialog";
import "./scss/MyTaskTable.scss";
import CustomRow from "components/CustomRow";
import css from "css/ProjectInfo.module.css";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import CustomButton from "components/CustomButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import AddIcon from "@material-ui/icons/Add";
import { useAddTask } from "react-query/mywork/useAddTask";
import { useMyWorkUpdateTask } from "react-query/mywork/useMyWorkUpdateTask";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import SubTaskInfoSidebar from "pages/projects/milestone/SubTaskInfoSidebar";
import CustomPopper from "components/CustomPopper";
import CustomAvatar from "components/CustomAvatar";
import BugAssignees from "pages/projects/bug/BugAssignees";
import { infoToast, warnToast } from "utils/toast";
import { LightTooltip } from "components/tooltip/LightTooltip";
import Image from "components/defaultImage/Image";
import { textTruncateMore } from "utils/textTruncate";

function MyTaskTable({ item: project, loading, editTaskRowId, orgId, filter }) {
  const [currentIndex, setCurrentIndex] = useState([]);
  const [collapsible, setCollapsible] = useState(false);
  const [addTaskName, setAddTaskName] = useState("");

  const [taskWillAdd, setTaskWillAdd] = useState(false);

  const [taskChecked, setTaskChecked] = useState({});

  const [taskInfo, setTaskInfo] = useState(null);
  const [activeTaskId, setActiveTaskId] = useState("");
  const [openSidebar, setOpenSidebar] = useState(false);
  const userType = useSelector((state) => state.userReducer?.userType);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const { mutateTask, taskUpdateStatus } = useMyWorkUpdateTask();

  // console.log("project:", project);

  const insertRow_id = (id) => {
    // console.log("projectId:", id);
    if (currentIndex.includes(id)) {
      setCollapsible(false);
      setTimeout(() => {
        setCurrentIndex(currentIndex.filter((item) => item !== id));
      }, 3);
    } else {
      setCollapsible(true);
      // setCurrentMilestoneId(id);
      setCurrentIndex([...currentIndex, id]);
    }
  };

  // console.log("=== orgId, currentIndex[0]", orgId, currentIndex[0]);

  let { isTasksLoading, tasksData, statusProjectTask } = useProjectTasks(
    orgId,
    currentIndex[0],
    8,
    1
  );

  const heightCalculate = (length) => {
    // loading
    if (isTasksLoading) {
      return 2 * 40 + 100;
    } else if (statusProjectTask === "error") {
      return 2 * 40 + 100;
    } else if (length === 0) {
      return 2 * 40 + 20;
    }

    return (length ?? 0) * 40 + 100;
  };

  // console.log("statusProjectTask:", statusProjectTask);

  const handleChangeCheckbox = (e) => {
    // console.log("e.target.checked:", e.target.checked);
    setTaskChecked({ [e.target.name]: e.target.checked });
    let sendData = {
      orgId: orgId,
      taskId: e.target.name,
      projectId: currentIndex[0],
      data: {
        status: e.target.checked ? "Completed" : "NotStarted",
      },
      type: "checkbox",
    };
    // console.log("sendData:", sendData);
    mutateTask(sendData);
  };

  const handleStatus = (id) => (status) => {
    let data = { status: status.value };

    let sendData = {
      orgId: orgId,
      taskId: id,
      projectId: currentIndex[0],
      type: "status",
      data: {
        status: status.value,
      },
    };
    // console.log("sendData:", sendData);
    mutateTask(sendData);
  };

  console.log("taskTable filter:", filter);

  const { priority, status } = filter;
  // console.log("currentIndex:", currentIndex);
  useEffect(() => {
    // alert("a");
    if (status?.length || priority?.length) {
      let temp = [];
      temp = tasksData?.filter(
        (row) =>
          status.includes(row.status) || priority?.includes(row?.priority)
      );
      setFilteredTasks(temp);
    } else {
      setFilteredTasks(tasksData);
    }
  }, [status?.length, priority?.length, tasksData]);

  // console.log({ filteredTasks });

  return (
    <>
      <div
        key={project?._id}
        className={`milestoneContainer mb-2`}
        key={project?._id}
        style={{
          height: collapsible ? heightCalculate(tasksData?.length) : 50, // array length
        }}
      >
        {/* Header Div */}
        <div
          className={`tableRow alignCenter milestone rowHeader`}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            project?._id !== "localData" &&
              // editRowId === null &&
              insertRow_id(project?._id);
          }}
          style={{
            position: "sticky",
            top: 68,
            opacity: project?._id === "localData" ? 0.3 : 1,
            backgroundColor: "var(--milestoneRowColor)",
          }}
        >
          {/* {console.log(currentIndex)} */}
          <div className={`arrowContainer`}>
            <ArrowRightIcon
              className={`milestone_arrowContainer 
              ${
                currentIndex.includes(project?._id)
                  ? "milestone_arrowContainer_90degree"
                  : ""
              }`}
            />
          </div>
          <div
            className="d_flex alignCenter"
            style={{
              flex: 0.3,
              height: "100%",
            }}
          >
            <div
              onClick={(e) => {
                if (project?._id !== "localData") {
                  // handleRowEditing(e, project?._id);
                  // setMilestoneName(project?.title);
                }
              }}
              className="milestoneTitleEllipse cursorText"
            >
              {project?.title}
            </div>
          </div>
          {/* <div className="d_flex alignCenter justifyContent-end px-3">
            <InfoOutlinedIcon
              onClick={(event) => {
                if (project?._id !== "localData") {
                  event.preventDefault();
                  event.stopPropagation();
                }
              }}
            />
          </div> */}
          <div></div>
          <div
            className="milestone_cell"
            style={{
              flex: 0.2,
              height: "100%",
            }}
          >
            Assignee
          </div>
          <div
            className="milestone_cell"
            style={{
              flex: 0.2,
              height: "100%",
            }}
          >
            Priority
          </div>
          <div
            className="milestone_cell"
            style={{
              flex: 0.2,
              height: "100%",
            }}
          >
            DueDate
          </div>
          <div
            className="milestone_cell"
            style={{
              flex: 0.2,
              height: "100%",
            }}
          >
            Status
          </div>
        </div>
        {/* header ends */}

        {/* Sub Header Div NEW Add */}
        <div
          className={`milestone_subContainer  normalFont ${
            collapsible ? "activeABC" : ""
          }`}
        >
          {currentIndex?.includes(project?._id) &&
            (isTasksLoading ? (
              <TableRowSkeleton count={2} height={30} />
            ) : (
              <>
                {filteredTasks?.length === 0 ? (
                  <p style={{ marginTop: "1rem", fontSize: ".8rem" }}>
                    {/* No Task Available */}
                  </p>
                ) : (
                  ""
                )}
                {statusProjectTask === "error" ? (
                  <p style={{ marginTop: "1rem", fontSize: ".8rem" }}>
                    Something went wrong
                  </p>
                ) : null}
                {
                  // priority?.length || status?.length ? (
                  filteredTasks?.map((row, i) => {
                    return (
                      <div
                        key={row?._id}
                        className={`tableRowEl   ${row?.status === "Completed" ? "completedRow" : ""}`}
                        style={{ opacity: row?.localData ? 0.3 : 1 }}
                      >
                        <div
                          className={
                            !row?.localData
                              ? `  subMilestone_sideLine_noHover d_flex alignCenter   ${row?.status === "Completed" ? "completedRowSideLine" : ""}`
                              : "d_flex alignCenter"
                          }
                          style={{
                            width: row.localData && 5,
                            opacity: row?.localData ? 0.3 : 1,
                            // background: `${
                            //   row.status === "Completed" ? `#228b22` : "#f2983e"
                            // }`,
                          }}
                        ></div>
                        <div
                          className={`subMilestone_title alignCenter d_flex  `}
                        >
                          {editTaskRowId === row?._id ? (
                            <ClickAwayListener>
                              <input
                                type="text"
                                style={{ width: "100%" }}
                                autoFocus
                                className=" px-2"
                              />
                            </ClickAwayListener>
                          ) : (
                            <LightTooltip title={row?.title}>
                              <p
                                className="cursorText px-2"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                {textTruncateMore(row?.title, 50)}
                              </p>
                            </LightTooltip>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <InfoOutlinedIcon
                            onClick={() => {
                              setActiveTaskId(row._id);
                              setOpenSidebar(true);
                            }}
                            style={{ cursor: "pointer" }}
                          />
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Image
                            src={row?.assignee?.[0]?.profilePicture}
                            title={row?.assignee?.[0]?.name}
                            style={{
                              fontSize: row?.assignee?.[0]?.name ? 14 : 9,
                            }}
                          />

                          {/* <CustomPopper
                            disabled={true}
                            value={
                              <CustomAvatar
                                small
                                className="mx-1"
                                src={row?.assignee[0]?.profilePicture}
                                title={row?.assignee[0]?.name ?? "No Assignee"}
                              />
                            }
                            content={<BugAssignees type="subTask" />}
                            noHover={true}
                          /> */}
                        </div>
                        <div
                          className={`subMilestone_assignee milestone_cell  border_solid_bottom border_solid_left`}
                        >
                          <CustomMenu
                            menuItems={[
                              { label: "Low", value: "Low" },
                              { label: "Medium", value: "Medium" },
                              { label: "High", value: "High" },
                            ]}
                            id={row?._id}
                            disabled
                            activeMenuItem={row?.priority}
                          />
                        </div>
                        <div
                          className={`subMilestone_priority milestone_cell border_solid_bottom border_solid_left `}
                        >
                          {row?.dueDate
                            ? moment(row.dueDate).format("DD-MM-YYYY")
                            : "N.A"}
                        </div>
                        <div
                          style={{
                            cursor: "pointer ",
                            justifyContent: "space-evenly",
                          }}
                          className={`subMilestone_platform milestone_cell border_solid_bottom border_solid_left`}
                        >
                          <CustomMenu
                            menuItems={[
                              { label: "Not Started", value: "NotStarted" },
                              { label: "Completed", value: "Completed" },
                              { label: "Active", value: "Active" },
                            ]}
                            id={row?._id}
                            handleMenuClick={
                              row?.id !== "localData" && handleStatus(row._id)
                            }
                            activeMenuItem={addSpaceUpperCase(row?.status)}
                          />
                        </div>

                        <CustomSideBar
                          show={openSidebar && activeTaskId === row._id}
                          toggle={() => setOpenSidebar(false)}
                        >
                          <SubTaskInfoSidebar
                            taskInfo={row}
                            orgId={orgId}
                            fromModule="MyWork"
                            projectId={currentIndex[0]}
                            userType={userType}
                          />
                        </CustomSideBar>
                      </div>
                    );
                  })
                  // ) : (
                  //   <div>asdadad</div>
                  // )
                  // null
                }
              </>
            ))}
        </div>
      </div>
    </>
  );
}
export default MyTaskTable;
