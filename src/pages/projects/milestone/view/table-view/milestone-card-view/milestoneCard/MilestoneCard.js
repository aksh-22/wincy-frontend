import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DateRangeIcon from "@material-ui/icons/DateRange";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import InputTextClickAway from "components/clickawayComponent/InputTextClickAway";
import CustomChip from "components/CustomChip";
import CustomDatePicker from "components/customDatePicker/CustomDatePicker";
import CustomProgressBar from "components/customProgressBar/CustomProgressBar";
import IosIcon from "components/icons/IosIcon";
import moment from "moment";
import React, { memo } from "react";
import { useUpdateMilestone } from "react-query/milestones/useUpdateMilestone";
import { useHistory } from "react-router-dom";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import { capitalizeFirstLetter } from "utils/textTruncate";
import classes from "./MilestoneCard.module.css";
const getProjectProgress = (milestoneCount) => {
  if (!milestoneCount) {
    return 0;
  } else if (!milestoneCount.Completed) {
    return 0;
  } else {
    let denominator =
      (milestoneCount.Active ?? 0) +
      (milestoneCount?.NotStarted ?? 0) +
      (milestoneCount?.Completed ?? 0) +
      (milestoneCount?.UnderReview ?? 0) +
      (milestoneCount?.ReviewFailed ?? 0) +
      (milestoneCount?.WaitingForReview ?? 0) +
      (milestoneCount?.OnHold ?? 0);
    return (milestoneCount?.Completed / denominator) * 100;
  }
};

const milestoneStatusColor = {
  Active: "var(--skyBlue)",
  NotStarted: "var(--lightOrange)",
  Completed: "var(--chipGreen)",
};
const MilestoneCard = memo(({ info, id, projectId, disabled, orgId }) => {
  const history = useHistory();
  const { mutate: updateMilestone } = useUpdateMilestone();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // width: "100px",
    // height: "100px",
    // border: "2px solid red",
    // backgroundColor: "#cccccc",
    // margin: "10px",
    zIndex: isDragging ? "100" : "auto",
    opacity: isDragging ? 0.7 : 1,
    outline: "none",
    cursor: "pointer",
  };

  const onTitleUpdate = (value) => {
    let sendData = {
      orgId,
      projectId,
      milestoneId: info?._id,
      data: {
        title: value,
      },
    };
    updateMilestone(sendData);
  };

  const onDueDateUpdate = (value) => {
    let sendData = {
      orgId,
      projectId,
      milestoneId: info?._id,
      data: {
        dueDate: value,
      },
    };
    updateMilestone(sendData);
  };

  const { push } = useHistory();

  return (
    <div className="boxShadow" ref={setNodeRef} style={style}>
      {/* <Link
        to={{
          pathname: `/main/projects/${projectId}/${info?._id}`,
          state: { _id: info?._id, module: true , milestoneInfo : info },
        }}
        
      > */}
      <div
        className={`${classes.projectBox} ${classes.milestoneCard_} ${
          info?.disabled ? classes.milestoneDisable : ""
        }`}
        onClick={(e) => {
          if (info?.disabled) {
          } else {
          }
          push({
            pathname: `/main/projects/${projectId}/${info?._id}`,
            state: { _id: info?._id, module: true, milestoneInfo: info },
          });
        }}
      >
        <div className="p-1">
          <div className="alignCenter">
            {!disabled && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                style={{
                  cursor: "grab",
                  marginBottom: 5,
                  // width:20,
                  // display:"flex",
                  // alignItems:"center",
                  // justifyContent:"center"
                }}
              >
                <DragIndicatorIcon
                  style={{
                    outline: "none",
                  }}
                  {...listeners}
                  {...attributes}
                />
              </div>
            )}
            <InputTextClickAway
              value={capitalizeFirstLetter(info?.title)}
              type="text"
              className={`${classes.projectName} ralewaySemiBold flex `}
              containerStyle={{
                fontSize: 18,
                marginBottom: 10,
                textTransform: "inherit",
              }}
              textClassName={"textEllipse"}
              textStyle={{
                paddingLeft: 0,
              }}
              style={{
                fontSize: 16,
                marginRight: 10,
                height: 25,
                // marginBottom : 10
              }}
              disabled={disabled}
              onChange={onTitleUpdate}
              // disabled={actionDisabled || taskInfo?.disabled ? true : false}
            />
          </div>

          <CustomChip
            className={"mb-1"}
            label={addSpaceUpperCase(info?.status)}
            bgColor={milestoneStatusColor?.[info?.status] ?? "var(--red)"}
            // className={`mr-1 mb-05    ${'ff_Lato_Regular'}`}
          />
        </div>
        <div className={classes.milestoneSection2}>
          <div className={classes.milestoneSection2_innerSection}>
            <CustomDatePicker
              // minDate={new Date()}
              onChange={onDueDateUpdate}
              defaultValue={info?.dueDate}
              disabled={disabled}
              innerContainerStyle={"justifyContent_start"}
              containerStyle={{
                height: "auto",
                width: "auto",
              }}
            >
              <div>
                <p
                  style={{
                    // fontSize: 10,
                    marginBottom: 4,
                    // textTransform: "uppercase",
                  }}
                >
                  Due Date
                </p>
                {/* <LightTooltip> */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "var(--red)",
                  }}
                >
                  <DateRangeIcon style={{ fontSize: 20, marginRight: 5 }} />
                  {info?.dueDate ? (
                    <p>{moment(info?.dueDate).format("DD-MMM-YYYY")}</p>
                  ) : (
                    <p>N/A</p>
                  )}
                </div>
                {/* </LightTooltip> */}
              </div>
            </CustomDatePicker>
            {/* <p>Due Date</p>
              <p>{moment().format("DD-MM-YYYY")}</p> */}
          </div>
          <div className={classes.milestoneSection2_innerSection2}>
            <p>Modules</p>
            <div className="alignCenter">
              <ViewComfyIcon style={{ fontSize: 20, color: "#8A9AFF" }} />{" "}
              <p style={{ fontSize: 13, marginLeft: 5 }}>
                {info?.moduleCount ?? 0}
              </p>
            </div>
          </div>
          <div className={classes.milestoneSection2_innerSection3}>
            <p>Tasks</p>
            <div className="alignCenter">
              <IosIcon
                name="taskIcon"
                style={{ height: 15, width: 15, marginLeft: 3 }}
              />

              <p style={{ fontSize: 13, marginLeft: 7 }}>
                {/* {(info?.taskCount?.NotStarted ?? 0) +
                  (info?.taskCount?.Active ?? 0) +
                  (info?.taskCount?.Completed ?? 0) +
                  (info?.taskCount?.UnderReview ?? 0) +
                  (info?.taskCount?.ReviewFailed ?? 0) +
                  (info?.taskCount?.WaitingForReview ?? 0) +
                  (info?.taskCount?.OnHold ?? 0)} */}
                {taskCount(info?.taskCount)}
              </p>
            </div>
          </div>
        </div>
        <div className="px-1 pb-1">
          <CustomProgressBar value={taskCount(info?.taskCount, true)} />
        </div>
        {/* <div className={classes.projectBox__header}>
            <div
              style={{
                display: "flex",
                // justifyContent: "space-between",
                alignItems: "center",
              }}
              
            >

<InputTextClickAway
                  value={info?.title}
                  type="text"
                  className={`${classes.projectName} ralewaySemiBold flex`}
                  containerStyle={{ fontSize: 22 }}
                  textStyle={{
                    paddingLeft : 0
                  }}
                  style={{
                    fontSize : 16,
                    marginRight  :10
                  }}
                  disabled={disabled}
                  onChange={onTitleUpdate}
                  // disabled={actionDisabled || taskInfo?.disabled ? true : false}
                />
           
              <div className={classes.headerInfo}>
                <div>
                  <p style={{ marginRight: 40 }}>MODULE</p>
                  <div className={classes.info}>
                    <ViewComfyIcon style={{ fontSize: 20 }} />
                    <p style={{ fontSize: 13, marginLeft: 5 }}>{info?.moduleCount ?? 0}</p>
                  </div>
                </div>
                <div>
                  <p>TASK</p>
                  <div className={classes.info}>
                    <AssignmentIcon style={{ fontSize: 18 }} />
                    <p style={{ fontSize: 13, marginLeft: 5 }}>{(info?.taskCount?.NotStarted ?? 0) + (info?.taskCount?.Active ?? 0) + (info?.taskCount?.Completed ?? 0)}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={classes.projectBox__tags}>
              <CustomChip
                label={addSpaceUpperCase(info?.status)}
                bgColor={milestoneStatusColor?.[info?.status] ?? "var(--red)"}
                // className={`mr-1 mb-05    ${'ff_Lato_Regular'}`}
              />
            </div>
          </div>

          <CustomProgressBar value={getProjectProgress(info?.milestoneCount)} />
          <div className="alignCenter justifyContent_between">
          <CustomDatePicker
      // minDate={new Date()}
      onChange={onDueDateUpdate}
      defaultValue={info?.dueDate}
      disabled={disabled}
      containerStyle={{
        height : "auto",
        width : "auto"
      }}
    >
            <div >
              <p
                style={{
                  fontSize: 10,
                  marginBottom: 4,
                  textTransform: "uppercase",
                }}
              >
                Due Date
              </p>
              <LightTooltip title="Start date">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "var(--red)",
                  }}
                >
                  <DateRangeIcon style={{ fontSize: 20, marginRight: 5 }} />
                  {info?.dueDate ? (
                    <p>{moment(info?.dueDate).format("DD-MMM-YYYY")}</p>
                  ) : (
                    <p>N/A</p>
                  )}
                </div>
              </LightTooltip>
            </div>
</CustomDatePicker>
            <div className="">
              <p
                style={{
                  fontSize: 10,
                  marginBottom: 4,
                  textTransform: "uppercase",
                }}
              >
                Completed On
              </p>
              <LightTooltip title="Start date">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center", 
                    color: "var(--textColor)",
                  }}
                >
                  <DateRangeIcon style={{ fontSize: 20, marginRight: 5 }} />
                  {info?.completedOn ? (
                    <p>{moment(info?.completedOn).format("DD-MMM-YYYY")}</p>
                  ) : (
                    <p>N/A</p>
                  )}
                </div>
              </LightTooltip>
            </div>
          </div> */}
      </div>
      {/* </Link> */}
    </div>
  );
});

export default MilestoneCard;

const taskCount = (taskCount, percentage) => {
  if (!taskCount) {
    return 0;
  }
  let count = 0;
  for (let keys in taskCount) {
    count += taskCount[keys];
  }

  if (percentage) {
    count =
      (taskCount?.Completed /
        // + (taskCount?.OnHold || 0)
        (count || 1)) *
      100;
  }
  return count;
};
