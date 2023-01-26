import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ClickAwayListener } from "@material-ui/core";
import "./MilestoneModule.scss";
// import AddCircleOutlineSharpIcon from "@mui/icons-material/AddCircleOutlineSharp";
// import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
// import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
// import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import Icon from "components/icons/IosIcon";
import { LightTooltip } from "components/tooltip/LightTooltip";
import { useQueryClient } from "react-query";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import { useProjectTeam } from "hooks/useUserType";
import CustomDatePicker from "components/customDatePicker/CustomDatePicker";
import moment from "moment";
import CustomMenu from "components/CustomMenu";
import ErrorIcon from "@mui/icons-material/Error";
import { useAddTask } from "react-query/milestones/task/useAddTask";
import { dateCondition } from "utils/dateCondition";

function AddTaskRow({
  orgId,
  milestoneId,
  projectId,
  moduleInfo,
  disabled,
  style,
  taskId,
}) {
  const queryClient = useQueryClient();
  const { platforms, team } = useProjectTeam();

  // Platform Menu Items
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

  //   Esc key detect
  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      clearDetails();
    }
  }, []);
  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);
  const [isEdit, setIsEdit] = useState(false);

  const [taskDetails, setTaskDetails] = useState({
    title: "",
    dueDate: "",
    assignee: [],
    assignees: [],
    platforms: [],
    status: "NotStarted",
  });

  const handleAssignee = ({ teamData, teamIds }) => {
    setTaskDetails({
      ...taskDetails,
      assignee: [...teamData],
      assignees: teamIds,
    });
  };

  const onSubmit = () => {
    if (!taskDetails?.title?.trim().length) {
      return setError("Please fill task name field");
    }
    const taskList = queryClient.getQueryData(["tasks", orgId, milestoneId]);
    const task = taskList?.filter((item) => item?._id?.[0] === moduleInfo?._id);
    if (task?.length) {
      let alreadyTaskNameExist = task?.[0]?.tasks?.filter(
        (item) =>
          item?.title?.trim()?.toLowerCase() ===
          taskDetails?.title?.trim()?.toLowerCase()
      );
      if (alreadyTaskNameExist?.length) {
        setError("This task Name is already exist.");
      } else {
        addTaskFunction();
      }
    } else {
      addTaskFunction();
    }
    // setIsEdit(false);
  };

  // Add Task Process
  const { mutate } = useAddTask();
  const addTaskFunction = () => {
    let data = {
      data: {
        ...taskDetails,
        module: moduleInfo?._id,
        parent: taskId,
      },
      orgId,
      projectId,
      milestoneId,
      moduleInfo,
      callBack: clearDetails,
      parentId: taskId,
    };
    mutate(data);
  };

  const [assigneePopup, setAssigneePopup] = useState(false);
  const [dueDatePopup, setDueDatePopup] = useState(false);
  const [platformPopup, setPlatformPopup] = useState(false);
  const [error, setError] = useState("");
  const dateChanger = (value) => {
    setTaskDetails({
      ...taskDetails,
      dueDate: value,
    });
  };

  const clearDetails = () => {
    setTaskDetails({
      title: "",
      dueDate: "",
      assignee: [],
      assignees: [],
      platforms: [],
      status: "NotStarted",
    });
    setError("");
    setIsEdit(false);
  };
  return (
    <ClickAwayListener
      disableReactTree
      onClickAway={(e) => {
        if (!assigneePopup && !dueDatePopup && !platformPopup) setIsEdit(false);
      }}
    >
      {!isEdit ? (
        <div
          className="tableRowModule addRowModule "
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsEdit(true);
          }}
        >
          <div className="d_flex ">
            <div className="firstEmptyCell" />
            <div className="sideLine" />
            <p className="alignCenter pl-1 borderBottom flex"> +Add</p>
          </div>
          <div className="borderBottom" />
          <div className="borderBottom" />
          <div className="borderBottom" />
          <div className="borderRight" />
        </div>
      ) : (
        <div className="tableRowModule " style={style}>
          <div className="d_flex flex">
            <div className="firstEmptyCell" onClick={() => setIsEdit(false)} />
            <div
              className="d_flex flex"
              style={{
                position: "relative",
              }}
            >
              <div
                className="sideLine"
                style={{
                  background: error ? "var(--red)" : "",
                }}
              />
              <input
                placeholder="Task Title"
                autoFocus
                className="pl-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onSubmit();
                  }
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setAssigneePopup(false);
                  setDueDatePopup(false);
                  setPlatformPopup(false);
                }}
                value={taskDetails?.title}
                onChange={(e) => {
                  setTaskDetails({
                    ...taskDetails,
                    title: e.target.value,
                  });
                  setError("");
                }}
                style={{
                  height: 40,
                  borderColor: error ? "var(--red)" : "",
                }}
              />
              {error && (
                <LightTooltip title={error} arrow>
                  <div
                    style={{
                      position: "absolute",
                      top: "55%",
                      right: 5,
                      transform: "translateY(-50%)",
                    }}
                  >
                    <ErrorIcon
                      style={{
                        color: "var(--red)",
                      }}
                    />
                  </div>
                </LightTooltip>
              )}
            </div>
          </div>
          <ClickAwayListener onClickAway={() => setAssigneePopup(true)}>
            <div
              className="alignCenter justifyContent_center borderRight"
              onClick={() => setAssigneePopup(true)}
            >
              {/* <LightTooltip title="Add Assignee" arrow>
              <div>
                <Icon name="addRound" />
              </div>
            </LightTooltip> */}
              <AssigneeSelection
                assignee={taskDetails?.assignee}
                multiple
                team={team}
                onChange={handleAssignee}
                contentCenter
                disabled={disabled}
              />
            </div>
          </ClickAwayListener>
          <ClickAwayListener onClickAway={() => setDueDatePopup(false)}>
            <div
              className="alignCenter justifyContent_center borderRight"
              onClick={() => setDueDatePopup(true)}
            >
              <CustomDatePicker
                // minDate={new Date()}
                onChange={dateChanger}
                defaultValue={taskDetails?.dueDate}
                disabled={disabled}
              >
                {taskDetails?.dueDate ? (
                  <div>{dateCondition(taskDetails?.dueDate)}</div>
                ) : (
                  <LightTooltip title="Add Due Date" arrow>
                    <div>
                      <Icon name="calendar" />
                    </div>
                  </LightTooltip>
                )}
              </CustomDatePicker>
            </div>
          </ClickAwayListener>
          <ClickAwayListener onClickAway={() => setPlatformPopup(false)}>
            <div className="alignCenter justifyContent_center borderBottom">
              <CustomMenu
                activeMenuItem={taskDetails?.platforms}
                menuItems={platformsList ?? []}
                multiple
                handleMenuClick={(value) => {
                  setTaskDetails({ ...taskDetails, platforms: value });
                }}
                disabled={disabled}
              />
            </div>
          </ClickAwayListener>
          <div className="alignCenter justifyContent_center borderRight">
            <LightTooltip title="Add Task" arrow>
              <div className="cursorPointer mr-1" onClick={onSubmit}>
                <Icon name="check" />
              </div>
            </LightTooltip>

            <LightTooltip title="Esc" arrow>
              <div onClick={clearDetails} className="cursorPointer">
                <Icon name="cross" />
              </div>
            </LightTooltip>
          </div>
        </div>
      )}
    </ClickAwayListener>
  );
}

export default AddTaskRow;
