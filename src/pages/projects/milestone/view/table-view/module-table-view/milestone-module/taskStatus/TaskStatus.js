import Popover from "@mui/material/Popover";
import CommonDialog from "components/CommonDialog";
import Image from "components/defaultImage/Image";
import CheckBoxSquare from "components/icons/CheckBoxSquare";
import React, { memo, useEffect, useState } from "react";
import { useUpdateTask } from "react-query/milestones/task/useUpdateTask";
import { useSelector } from "react-redux";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import OnHoldReason from "./OnHoldReason";
import "./TaskStatus.scss";
import { LightTooltip } from "components/tooltip/LightTooltip";
import { useHistory } from "react-router-dom";
const checkBoxStyle = {
  height: 14,
  width: 14,
};
function TaskStatus({
  info = {},
  className,
  orgId,
  disabled,
  taskStatusPermission,
  individualStatusUpdatePermission,
  actionButton,
  parentId,
}) {
  const { status, assignees, assigneesStatus } = info;
  const [anchorEl, setAnchorEl] = useState(null);
  const handlePopoverOpen = (event) => {
    if (
      status === "ReviewFailed" &&
      (info?.bugCount?.total ?? 0) - (info?.bugCount?.totalDone ?? 0) !== 0
    ) {
      push(`/main/task/projects/${info?.project}/${info?._id}`);
      // push(`/main/projects/${info?.project}/bugs`)

      return null;
    }

    if (taskStatusPermission && status === "OnHold") {
      return null;
    }

    !disabled && setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const [teamStatus, setTeamStatus] = useState([]);
  const [myStatus, setMyStatus] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  // const [checkBoxType, setCheckBoxType] = useState(null);
  const userType = useSelector((state) => state.userReducer?.userType);

  useEffect(() => {
    let tempStatus = assigneesStatus?.find(
      (item) => item?.assignee === userType?.userId
    );
    tempStatus && setMyStatus(tempStatus?.status);
  }, [assigneesStatus, userType]);

  useEffect(() => {
    let temp = [...(assignees ?? [])];
    let obj = {};
    assigneesStatus?.map((item) => {
      obj[item?.assignee] = item?.status;
      return null;
    });

    for (let i = 0; i < temp?.length; i++) {
      temp[i] = {
        ...temp[i],
        status: obj?.[temp[i]?._id],
      };
    }

    setTeamStatus([...temp]);
  }, [assignees, assigneesStatus]);
  const { mutate } = useUpdateTask();
  const handleStatusChange = (currentStatus) => {
    if (myStatus === currentStatus) return null;
    // currentStatus === "Completed" ? setIsCompleted(true) : setIsCompleted(false);
    for (let i = 0; i < assigneesStatus?.length; i++) {
      if (assigneesStatus[i]?.assignee === userType?.userId) {
        assigneesStatus[i].status = currentStatus;
        break;
      }
    }
    mutate({
      data: {
        myStatus: currentStatus,
      },
      milestoneId: info?.milestone,
      projectId: info?.project,
      orgId: orgId,
      taskId: info?._id,
      moduleId: info?.module,
      myStatus: true,
      assigneesStatus,
      parentId,
    });

    for (let i = 0; i < teamStatus?.length; i++) {
      if (teamStatus[i]?._id === userType?.userId) {
        teamStatus[i].status = currentStatus;
        break;
      }
    }

    setTeamStatus(teamStatus);
    setMyStatus(currentStatus);
  };

  const handleTaskStatus = (currentStatus, onHoldReason) => {
    if (info?.status === currentStatus) return null;
    if (currentStatus === "OnHold" && !onHoldReason) {
      handlePopoverClose();
      return setIsOnHold(true);
    }
    !actionButton &&
      (currentStatus === "Completed"
        ? setIsCompleted(true)
        : setIsCompleted(false));

    setIsOnHold(false);
    let data = {
      status: currentStatus,
    };

    if (onHoldReason) {
      data = {
        onHoldReason,
        status: currentStatus,
      };
    }
    mutate({
      data: data,
      milestoneId: info?.milestone,
      projectId: info?.project,
      orgId: orgId,
      taskId: info?._id,
      moduleId: info?.module,
      updateTaskStatus: currentStatus,
      parentId,
    });
  };
  const [isCompleted, setIsCompleted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const { push } = useHistory();
  return (
    <div
      className={`${className} inheritParent tagStatusHover`}
      style={{
        backgroundColor:
          !actionButton &&
          getBackgroundColor({
            label:
              status === "ReviewFailed" &&
              (info?.bugCount?.total ?? 0) -
                (info?.bugCount?.totalDone ?? 0) !==
                0
                ? addSpaceUpperCase(status)
                : status === "ReviewFailed" &&
                  (info?.bugCount?.total ?? 0) -
                    (info?.bugCount?.totalDone ?? 0) ===
                    0
                ? addSpaceUpperCase("WaitingForReview")
                : addSpaceUpperCase(status),
          }),
        position: "relative",
        borderRightWidth: 0,
      }}
    >
      {isOnHold && (
        <CommonDialog
          shouldOpen={isOnHold}
          OtherClose={() => setIsOnHold(false)}
          content={
            <OnHoldReason
              handleClose={() => setIsOnHold(false)}
              handleTaskStatus={handleTaskStatus}
            />
          }
          modalTitle={"On Hold Reason"}
          minWidth={"30vw"}
        />
      )}
      {!actionButton && <div className="myStatusTag" />}
      {isCompleted && <div className="done-crazy-balls-status-animation" />}
      {actionButton ? (
        <div onClick={handlePopoverOpen}> {actionButton} </div>
      ) : (
        <LightTooltip
          arrow
          title={
            status === "ReviewFailed" &&
            (info?.bugCount?.total ?? 0) - (info?.bugCount?.totalDone ?? 0) !==
              0
              ? "Please solve these issues"
              : ""
          }
        >
          <div
            onClick={handlePopoverOpen}
            className="inheritParent alignCenter justifyContent_center  "
            data-label="In Progress"
            style={{
              cursor:
                disabled || (taskStatusPermission && status === "OnHold")
                  ? "default"
                  : "pointer",
              position: "relative",
              overflow: status === "OnHold" ? "inherit" : "hidden",
            }}
          >
            <p>
              {" "}
              {status === "ReviewFailed" &&
              (info?.bugCount?.total ?? 0) -
                (info?.bugCount?.totalDone ?? 0) !==
                0
                ? `Review Failed (${
                    (info?.bugCount?.total ?? 0) -
                    (info?.bugCount?.totalDone ?? 0)
                  })`
                : status === "ReviewFailed" &&
                  (info?.bugCount?.total ?? 0) -
                    (info?.bugCount?.totalDone ?? 0) ===
                    0
                ? "WaitingForReview"
                : addSpaceUpperCase(status)}
            </p>

            {/* {status === "OnHold" && info?.onHoldReason && <div style={{
            position:"absolute",
            top:2,
            left:2
          }}>
            <LightTooltip title={info?.onHoldReason} >
              <div>
<InfoRoundedIcon style={{fontSize:16}}/>
          
              </div>
            </LightTooltip>
            </div>} */}
          </div>
        </LightTooltip>
      )}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        PaperProps={{
          style: {
            background: "var(--popUpColor)",
            color: "#FFF",
            minWidth: 250,
          },
        }}
      >
        <div className="modal_box">
          {/* Task Status */}
          {!taskStatusPermission && (
            <>
              <div
                className="modal_header"
                style={{
                  paddingBottom: 5,
                }}
              >
                <p>Task Status</p>
              </div>
              <div
                style={{
                  marginTop: 10,
                  padding: "0 10px",
                }}
              >
                {/* add prop height and width in CheckBoxSquare  */}
                <div
                  className="alignCenter cursorPointer mb-1"
                  style={{ color: "#0098EB" }}
                  onClick={() => handleTaskStatus("Active")}
                >
                  <CheckBoxSquare
                    containerStyle={checkBoxStyle}
                    style={checkBoxStyle}
                    isChecked={status === "Active"}
                  />
                  <p style={{ marginLeft: 5 }}>Active</p>
                </div>
                <div
                  style={{
                    color: getBackgroundColor({ label: "Not Started" }),
                  }}
                  className="alignCenter cursorPointer mb-1"
                  onClick={() => handleTaskStatus("NotStarted")}
                >
                  <CheckBoxSquare
                    style={checkBoxStyle}
                    containerStyle={checkBoxStyle}
                    isChecked={status === "NotStarted"}
                  />
                  <p style={{ marginLeft: 5 }}>Not Started</p>
                </div>

                <div
                  style={{ color: "#928dff" }}
                  className="alignCenter cursorPointer mb-1"
                  onClick={() => handleTaskStatus("UnderReview")}
                >
                  <CheckBoxSquare
                    style={checkBoxStyle}
                    containerStyle={checkBoxStyle}
                    isChecked={status === "UnderReview"}
                  />
                  <p style={{ marginLeft: 5 }}>Under Review</p>
                </div>

                <div
                  style={{ color: "#2CDE56" }}
                  className="alignCenter cursorPointer mb-1"
                  onClick={() => handleTaskStatus("Completed")}
                >
                  <CheckBoxSquare
                    style={checkBoxStyle}
                    containerStyle={checkBoxStyle}
                    isChecked={status === "Completed"}
                  />
                  <p style={{ marginLeft: 5 }}>Completed</p>
                </div>

                <div
                  style={{ color: "var(--red)" }}
                  className="alignCenter cursorPointer mb-1"
                  onClick={() => handleTaskStatus("OnHold")}
                >
                  <CheckBoxSquare
                    style={checkBoxStyle}
                    containerStyle={checkBoxStyle}
                    isChecked={status === "OnHold"}
                  />
                  <p style={{ marginLeft: 5 }}>On Hold</p>
                </div>
              </div>
            </>
          )}
          {/* End */}

          {myStatus &&
            ![
              "WaitingForReview",
              "UnderReview",
              "Completed",
              "ReviewFailed",
            ].includes(status) && (
              <>
                <div
                  className="modal_header"
                  style={{
                    paddingBottom: 5,
                  }}
                >
                  <p>My Status</p>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    padding: "0 10px",
                  }}
                >
                  {/* add prop height and width in CheckBoxSquare  */}
                  <div
                    className="alignCenter cursorPointer mb-1"
                    style={{ color: "#0098EB" }}
                    onClick={() => handleStatusChange("Active")}
                  >
                    <CheckBoxSquare
                      containerStyle={checkBoxStyle}
                      style={checkBoxStyle}
                      isChecked={myStatus === "Active"}
                    />
                    <p style={{ marginLeft: 5 }}>Active</p>
                  </div>
                  <div
                    style={{
                      color: getBackgroundColor({ label: "Not Started" }),
                    }}
                    className="alignCenter cursorPointer mb-1"
                    onClick={() => handleStatusChange("NotStarted")}
                  >
                    <CheckBoxSquare
                      style={checkBoxStyle}
                      containerStyle={checkBoxStyle}
                      isChecked={myStatus === "NotStarted"}
                    />
                    <p style={{ marginLeft: 5 }}>Not Started</p>
                  </div>
                  <div
                    style={{ color: "#2CDE56" }}
                    className="alignCenter cursorPointer mb-1"
                    onClick={() => handleStatusChange("Completed")}
                  >
                    <CheckBoxSquare
                      style={checkBoxStyle}
                      containerStyle={checkBoxStyle}
                      isChecked={myStatus === "Completed"}
                    />
                    <p style={{ marginLeft: 5 }}>Completed</p>
                  </div>
                </div>
              </>
            )}

          {myStatus &&
            taskStatusPermission &&
            ["WaitingForReview", "UnderReview", "Completed"].includes(
              status
            ) && (
              <>
                <div
                  className="modal_header"
                  style={{
                    paddingBottom: 5,
                  }}
                >
                  <p>Task Status</p>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    padding: "0 10px",
                  }}
                >
                  {/* add prop height and width in CheckBoxSquare  */}
                  <div
                    className="alignCenter cursorPointer mb-1"
                    style={{ color: "##5F5CA8" }}
                    onClick={() => handleTaskStatus("UnderReview")}
                  >
                    <CheckBoxSquare
                      containerStyle={checkBoxStyle}
                      style={checkBoxStyle}
                      isChecked={status === "UnderReview"}
                    />
                    <p style={{ marginLeft: 5 }}>Under Review</p>
                  </div>
                  <div
                    style={{
                      color: getBackgroundColor({ label: "Not Started" }),
                    }}
                    className="alignCenter cursorPointer mb-1"
                    onClick={() => handleTaskStatus("Completed")}
                  >
                    <CheckBoxSquare
                      style={checkBoxStyle}
                      containerStyle={checkBoxStyle}
                      isChecked={status === "Completed"}
                    />
                    <p style={{ marginLeft: 5 }}>Completed</p>
                  </div>
                </div>
              </>
            )}

          {!individualStatusUpdatePermission && taskStatusPermission && (
            <div>
              <>
                <div
                  className="modal_header"
                  style={{
                    paddingBottom: 5,
                  }}
                >
                  <p>Task Status</p>
                </div>
                <div
                  style={{
                    marginTop: 10,
                    padding: "0 10px",
                  }}
                >
                  {/* add prop height and width in CheckBoxSquare  */}
                  <div
                    className="alignCenter cursorPointer mb-1"
                    style={{ color: "##5F5CA8" }}
                    onClick={() => handleTaskStatus("UnderReview")}
                  >
                    <CheckBoxSquare
                      containerStyle={checkBoxStyle}
                      style={checkBoxStyle}
                      isChecked={status === "UnderReview"}
                    />
                    <p style={{ marginLeft: 5 }}>Under Review</p>
                  </div>
                  <div
                    style={{
                      color: getBackgroundColor({ label: "Not Started" }),
                    }}
                    className="alignCenter cursorPointer mb-1"
                    onClick={() => handleTaskStatus("Completed")}
                  >
                    <CheckBoxSquare
                      style={checkBoxStyle}
                      containerStyle={checkBoxStyle}
                      isChecked={status === "Completed"}
                    />
                    <p style={{ marginLeft: 5 }}>Completed</p>
                  </div>
                </div>
              </>
            </div>
          )}

          {teamStatus?.length > 0 && (
            <>
              <div style={{ marginTop: 20 }}>
                <div
                  className="modal_header"
                  style={{ color: "#0098EB", paddingBottom: 5 }}
                >
                  <p>Active</p>
                </div>
                <div className="modal_avatars">
                  {teamStatus?.map(
                    (item, index) =>
                      item?.status === "Active" && (
                        <Image
                          style={{
                            border: `2px solid ${getBackgroundColor({
                              label: addSpaceUpperCase(item?.status),
                            })}`,
                          }}
                          src={item?.profilePicture}
                          title={item?.name}
                          key={index}
                        />
                      )
                  )}
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <div
                  className="modal_header"
                  style={{ color: "#F3B932", paddingBottom: 5 }}
                >
                  <p>Not Started</p>
                </div>
                <div className="modal_avatars">
                  {teamStatus?.map(
                    (item, index) =>
                      (item?.status === "NotStarted" || !item?.status) && (
                        <Image
                          style={{
                            border: `2px solid ${getBackgroundColor({
                              label: addSpaceUpperCase(item?.status),
                            })}`,
                          }}
                          src={item?.profilePicture}
                          title={item?.name}
                          key={index}
                        />
                      )
                  )}
                </div>
              </div>
              <div style={{ margin: "20px 0px" }}>
                <div
                  className="modal_header"
                  style={{ color: "#28CC4F", paddingBottom: 5 }}
                >
                  <p>Completed</p>
                </div>
                <div className="modal_avatars">
                  {teamStatus?.map(
                    (item, index) =>
                      item?.status === "Completed" && (
                        <Image
                          style={{
                            border: `2px solid ${getBackgroundColor({
                              label: addSpaceUpperCase(item?.status),
                            })}`,
                          }}
                          src={item?.profilePicture}
                          title={item?.name}
                          key={index}
                        />
                      )
                  )}
                </div>
              </div>

              {status === "OnHold" && (
                <div style={{ margin: "20px 0px" }}>
                  <div
                    className="modal_header"
                    style={{ color: "var(--red)", paddingBottom: 5 }}
                  >
                    <p>On Hold</p>
                  </div>
                  <div className="modal_avatars">
                    {teamStatus?.map(
                      (item, index) =>
                        (item?.status === "OnHold" || !item?.status) && (
                          <Image
                            style={{
                              border: `2px solid ${getBackgroundColor({
                                label: addSpaceUpperCase(item?.status),
                              })}`,
                            }}
                            src={item?.profilePicture}
                            title={item?.name}
                            key={index}
                          />
                        )
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Popover>
    </div>
  );
}

export default memo(TaskStatus);

export const getBackgroundColor = ({ label }) => {
  switch (label) {
    case "On Hold":
      return "#9ea7ad";
    case "Waiting For Review":
      return "#f17224";
    case "Under Review":
      return "#5F5CA8";
    case "Review Failed":
      return "var(--red)";

    case "Open":
      return "var(--milestoneRowElColor)";
    case "In Progress":
      return "var(--progressBarColor)";
    case "In Review":
      return "var(--primary)";
    case "Bug Persists":
      return "var(--red)";
    case "Done":
      return "var(--green)";

    case "High":
      return "var(--red)";
    case "Medium":
      return "#775CC3 ";
    case "Low":
      return "#686868";
    case "Active":
      return "#0098EB";
    case "Not Started":
      // return "#686868";
      return "#FFB300";
    case "Completed":
      return "#02CD79";
    case "Solved":
      return "#02CD79";
    case "Approved":
      return "#02CD79";
    case "Pending":
      return "#B6BAD5";
    // case "Active":
    // return "var(--chipGreen)";
    case "Idle":
      return "var(--chipYellow)";
    case "Awarded":
      return "var(--chipPink)";
    case "Rejected":
      return "var(--chipRed)";
    default:
      return "transparent";
  }
  //     #b339ff
  // #7c39ff
  // #B6BAD5
};
