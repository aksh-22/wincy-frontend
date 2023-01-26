import { Avatar, IconButton } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import BugReportIcon from "@material-ui/icons/BugReport";
import CloseIcon from "@material-ui/icons/Close";
import FilterListIcon from "@material-ui/icons/FilterList";
import FlagIcon from "@material-ui/icons/Flag";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import AppsSharpIcon from "@mui/icons-material/AppsSharp";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import TableRowsIcon from "@mui/icons-material/TableRows";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import BottomActionBar from "components/bottomActionBar/BottomActionBar";
import BtnWrapper from "components/btnWrapper/BtnWrapper";
import CustomButton from "components/CustomButton";
import CustomPopper from "components/CustomPopper";
import CustomProgressBar from "components/customProgressBar/CustomProgressBar";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import InfoIcon from "components/icons/InfoIcon";
import NoData from "components/NoData";
import { LightTooltip } from "components/tooltip/LightTooltip";
import "css/Milestone.css";
import ProfilePopupCss from "css/ProfilePopup.module.css";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useBugDelete } from "react-query/bugs/useBugDelete";
import { useDeleteTask } from "react-query/milestones/task/useDeleteTask";
import { useOrgTeam } from "react-query/organisations/useOrgTeam";
import { useProjectAllTasks } from "react-query/projects/useProjectAllTasks";
import { useProjectInfo } from "react-query/projects/useProjectInfo";
import { useUpdateAssignees } from "react-query/projects/useUpdateAssignTeam";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ProjectInfoSkeleton from "skeleton/projectCard/ProjectInfoSkeleton";
import { capitalizeFirstLetter, textTruncateMore } from "utils/textTruncate";
import Bugs from "../bug/Bugs";
import Credentials from "../credentials/Credentials";
import FilterInProject from "../FilterInProject";
import Milestone from "../Milestone";
import ProjectAttachment from "../projectAttachment/ProjectAttachment";
import Queries from "../queries/Queries";
import PaymentPhase from "./paymentPhase/PaymentPhase";
import classes from "./ProjectInfo.module.css";
import ProjectInfoSidebar from "./projectInfoSideBar/ProjectInfoSidebar";
import TextAnimation from "./Textanimation";

const mileStoneEditDisable = (userType, projectInfo) => {
  return ["Admin", "Member++"].includes(userType?.userType) ||
    projectInfo?.project?.projectHead?._id === userType?.userId
    ? false
    : true;
};

export default function ProjectInfo(props) {
  const { mutateUpdateAssignTeam } = useUpdateAssignees();
  const [viewType, setViewType] = useState("table");
  // const [currIndex, setCurrIndex] = useState(0);

  // const animate = () => {
  //   animateText.length === currIndex - 1 && setCurrIndex(0);
  //   setTimeout(() => {
  //     setCurrIndex((prev) => prev + 1);
  //   }, 3000);
  // };

  const {
    isLoading: projectInfoLoading,
    data: projectInfo,
    isError,
    error,
  } = useProjectInfo(props.match.params.id);
  // useEffect(() => {
  //   let abc;
  //   if (!projectInfoLoading) {
  //     abc = setTimeout(() => {
  //       if (animateText.length === currIndex + 1) {
  //         setCurrIndex(0);
  //       } else {
  //         setCurrIndex((prev) => prev + 1);
  //       }
  //     }, 3000);
  //   }
  //   // return abc;
  // }, [currIndex, projectInfoLoading]);
  const { location, push } = useHistory();
  const [projectInfoNav, setProjectInfoNav] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [queryStatus, setQueryStatus] = useState("Open");
  const [filter, setFilter] = useState({
    milestoneIds: [],
    taskIds: [],
    assigneeIds: [],
    status: [],
    priority: [],
    platforms: [],
    developerStatus: [],
    testerStatus: [],
    bugStatus: [],
    date: "",
    bugTaskIds: [],
  });

  useEffect(() => {
    let extraParameter = location?.pathname.split("/");
    if (
      extraParameter?.length === 5 &&
      !["bugs", "files", "credentials", "queries", "payment-phase"].includes(
        extraParameter[extraParameter?.length - 1]
      )
    ) {
      setProjectInfoNav(0);
    }

    if (extraParameter[extraParameter?.length - 1] === "bugs") {
      setProjectInfoNav(1);
    }
    if (extraParameter[extraParameter?.length - 1] === "files") {
      setProjectInfoNav(2);
    }
    if (extraParameter[extraParameter?.length - 1] === "credentials") {
      setProjectInfoNav(3);
    }
    if (extraParameter[extraParameter?.length - 1] === "queries") {
      setProjectInfoNav(4);
    }
    if (extraParameter[extraParameter?.length - 1] === "payment-phase") {
      setProjectInfoNav(5);
    }
  }, [location]);

  const handleProjectInfoNav = (id) => {
    id === 1 && push(`/main/projects/${props?.match?.params?.id}/bugs`);
    id === 2 && push(`/main/projects/${props?.match?.params?.id}/files`);
    id === 3 && push(`/main/projects/${props?.match?.params?.id}/credentials`);
    id === 4 && push(`/main/projects/${props?.match?.params?.id}/queries`);
    id === 5 &&
      push(`/main/projects/${props?.match?.params?.id}/payment-phase`);

    setProjectInfoNav(id);
    setIsSelected([]);
    setShowAddMilestone(false);
    clearFilter();
  };

  useEffect(() => {
    dispatch({
      type: "SET_FILTER",
      payload: filter,
    });
  }, [filter]);

  const showInfoToggle = () => {
    setShowInfo(!showInfo);
  };
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const userType = useSelector((state) => state.userReducer?.userType);
  useOrgTeam(orgId);
  useProjectAllTasks({
    orgId,
    projectId: props?.match?.params?.id,
  });

  const [isSelected, setIsSelected] = useState([]);
  const [milestoneIds, setMileStoneIds] = useState([]);
  const multiSelection = useCallback(
    (id, milestoneId) => {
      if (isSelected.includes(id)) {
        setIsSelected(isSelected.filter((item) => item !== id));
      } else {
        setIsSelected([id, ...isSelected]);
      }
      if (milestoneId !== undefined) {
        if (milestoneIds.includes(milestoneId)) {
          // setMileStoneIds(milestoneIds.filter((item) => item !== milestoneId));
        } else {
          setMileStoneIds([milestoneId, ...milestoneIds]);
        }
      }
    },
    [isSelected, milestoneIds]
  );
  const platformsColor = useSelector(
    (state) => state.userReducer?.userData?.platforms
  );
  const platformIds = useSelector(
    (state) => state.userReducer?.userData?.platformIds
  );
  const dispatch = useDispatch();
  useEffect(() => {
    // alert("Called")
    Array.isArray(projectInfo?.project?.platforms) &&
      projectInfo?.project &&
      setBugPlatform(
        Array(projectInfo?.project?.platforms?.length + 1)
          .fill("")
          .map((item, i) => ({
            name: projectInfo?.project?.platforms[i] ?? "Un-categorized",
            pageNo: 1,
            id: projectInfo?.project?.platforms[i]
              ? platformIds[projectInfo?.project?.platforms[i]]
              : null,
            color:
              projectInfo?.project?.platforms[i] === undefined
                ? "98,93,245" //Color code
                : platformsColor[projectInfo?.project?.platforms[i]],
          }))
      );
    let tempTeam = [];
    if (
      projectInfo?.project?.projectHead &&
      projectInfo?.project?.projectHead !== "" &&
      Object.keys(projectInfo?.project?.projectHead).length !== 0
    ) {
      tempTeam.push({
        ...projectInfo?.project?.projectHead,
        projectHead: true,
      });
    }
    tempTeam = [
      ...tempTeam,
      ...(projectInfo?.project?.team ? projectInfo?.project?.team : []),
    ];
    setTeam(tempTeam);
    let disabledAccess = mileStoneEditDisable(userType, projectInfo);
    dispatch({
      type: "SET_TEAM",
      payload: {
        ...projectInfo,
        team: tempTeam,
        orgId: orgId,
        projectId: props?.match?.params?.id,
        actionDisabled: disabledAccess,
        bugsPlatforms: projectInfo?.project?.platforms
          ? Array(projectInfo?.project?.platforms?.length + 1)
              .fill("")
              .map((item, i) => ({
                name: projectInfo?.project?.platforms[i] ?? "Un-categorized",
                label: projectInfo?.project?.platforms[i] ?? "Un-categorized",
                value: projectInfo?.project?.platforms[i] ?? "Un-categorized",
                pageNo: 1,
                menuName: "platform",
                id: projectInfo?.project?.platforms[i]
                  ? platformIds[projectInfo?.project?.platforms[i]]
                  : null,
                color:
                  projectInfo?.project?.platforms[i] === undefined
                    ? "98,93,245" //Color code
                    : platformsColor[projectInfo?.project?.platforms[i]],
              }))
          : [],
      },
    });
    // let newCount = [];
    // if (projectInfo?.tasksCount) {
    //   newCount.push(
    //     `Tasks ${projectInfo?.tasksCount?.completedTasks ?? 0}/${
    //       projectInfo?.tasksCount?.tasksTotal ?? 0
    //     }`
    //   );
    // }

    // if (projectInfo?.todosCount) {
    //   newCount.push(
    //     `Todos ${projectInfo?.todosCount?.completedTodos ?? 0}/${
    //       projectInfo?.todosCount?.totalTodos ?? 0
    //     }`
    //   );
    // }

    // if (projectInfo?.project?.milestoneCount) {
    //   let milestoneCount = projectInfo?.project?.milestoneCount;
    //   let denominator =
    //     (milestoneCount?.Active ?? 0) +
    //     (milestoneCount?.NotStarted ?? 0) +
    //     (milestoneCount?.Completed ?? 0);

    //   newCount.push(
    //     `Milestones ${milestoneCount?.Completed ?? 0}/${denominator ?? 0}`
    //   );
    // }

    // setProjectInfoCount(newCount);
  }, [projectInfo, projectInfo?.tasksCount]);

  // Team Array
  const [team, setTeam] = useState([]);
  // const [projectInfoCount, setProjectInfoCount] = useState([]);

  // Bugs
  const [bugPlatform, setBugPlatform] = useState([]);

  const { mutateDeleteBug, isDeleteBugLoading } = useBugDelete();

  // Task Delete
  const { deleteTaskMutate, isLoading: isDeleteTaskLoading } = useDeleteTask();
  const clearFilter = useCallback(() => {
    setFilter({
      milestoneIds: [],
      taskIds: [],
      assigneeIds: [],
      status: [],
      priority: [],
      platforms: [],
      developerStatus: [],
      testerStatus: [],
      bugStatus: [],
      date: "",
      bugTaskIds: [],
    });
  }, []);

  const filterCount = () => {
    const {
      assigneeIds,
      milestoneIds,
      taskIds,
      testerStatus,
      bugStatus,
      priority,
      platforms,
      status,
      date,
      bugTaskIds,
    } = filter;
    let filterCount =
      (assigneeIds?.length ? 1 : 0) +
      (milestoneIds?.length ? 1 : 0) +
      (taskIds?.length ? 1 : 0) +
      (testerStatus?.length ? 1 : 0) +
      (bugStatus?.length ? 1 : 0) +
      (priority?.length ? 1 : 0) +
      (platforms?.length ? 1 : 0) +
      (status?.length ? 1 : 0) +
      (date?.length ? 1 : 0) +
      (bugTaskIds?.length ? 1 : 0);
    let count = 0;
    for (const id in platformIds) {
      if (filter?.[platformIds[id]]) {
        filter?.[platformIds[id]]?.length > 0 && (count += 1);
      }
    }
    filterCount += count;
    return filterCount;
  };

  // Team Member Update
  const onTeamMemberUpdate = ({ assigneeData }) => {
    let projectHeadData = {};
    let projectHeadId = "";
    let teamData = [];
    let teamIds = [];
    assigneeData?.map((item) => {
      if (item?.projectHead) {
        projectHeadId = item?._id;
        projectHeadData = item;
      } else {
        teamIds.push(item?._id);
        teamData?.push(item);
      }
      return null;
    });
    mutateUpdateAssignTeam({
      data: {
        projectHead: projectHeadId,
        team: teamIds,
      },
      projectHeadData,
      teamData,
      orgId,
      projectId: props?.match?.params?.id,
    });
  };
  return isError ? (
    <NoData
      error
      title={
        error?.response?.data?.message ===
        "You are not authorised to perform this task"
          ? "You are not longer associated with this project."
          : false
      }
      errorStyleEnable
    />
  ) : (
    <>
      <div
        className="p-2"
        style={
          {
            // maxWidth: "95vw",
          }
        }
      >
        {projectInfoLoading ? (
          <ProjectInfoSkeleton />
        ) : (
          <>
            <div className="mb-1 d_flex">
              <Avatar
                src={projectInfo?.project?.logo}
                style={{
                  backgroundColor: "#13132D",
                  width: 60,
                  height: 60,
                  border: "1px solid var(--divider)",
                }}
              >
                <p
                  style={{
                    color: "var(--defaultWhite)",
                    textTransform: "capitalize",
                    fontFamily: "Raleway-SemiBold",
                    fontSize: 26,
                  }}
                >
                  {projectInfo?.project?.title?.[0]}
                </p>
              </Avatar>

              <div className={classes.headerDetails}>
                <div
                  className="d_flex alignCenter"
                  style={{ justifyContent: "space-between", width: "100%" }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <LightTooltip
                        title={
                          projectInfo?.project?.title?.length > 50
                            ? projectInfo?.project?.title
                            : ""
                        }
                        arrow
                      >
                        <p
                          className="headerFont mx-1 ralewaySemiBold"
                          style={{ fontSize: 26 }}
                        >
                          {textTruncateMore(
                            capitalizeFirstLetter(projectInfo?.project?.title),
                            50
                          )}
                        </p>
                      </LightTooltip>
                      <LightTooltip title="Project Information" arrow>
                        <IconButton onClick={showInfoToggle}>
                          <InfoIcon />
                        </IconButton>
                      </LightTooltip>
                    </div>
                    {/* <KanbanTaskAction /> */}

                    <div
                      className={`${classes.avatars}`}
                      style={{ marginTop: 5 }}
                    >
                      <AssigneeSelection
                        // team={team}

                        multiple
                        orgId={
                          ["Admin", "Member++"].includes(userType?.userType) ||
                          team?.filter(
                            (item) =>
                              item?._id === userType?.userId &&
                              item?.projectHead === true
                          ).length > 0
                            ? orgId
                            : undefined
                        }
                        disabled={
                          ["Admin", "Member++"].includes(userType?.userType) ||
                          team?.filter(
                            (item) =>
                              item?._id === userType?.userId &&
                              item?.projectHead === true
                          ).length > 0
                            ? false
                            : true
                        }
                        projectId={props?.match?.params?.id}
                        team={team}
                        assignee={team}
                        onChange={onTeamMemberUpdate}
                        isProjectManager
                        plusDisable
                        style={{
                          height: 30,
                          width: 30,
                          backgroundColor: "var(--newBlue)",
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <TextAnimation
                      projectInfoLoading={projectInfoLoading}
                      animateText={projectInfo?.count ?? []}
                    />
                    <div className={classes.headerDeadline}>
                      <AssignmentTurnedInIcon
                        style={{ fontSize: 20, marginRight: 5 }}
                      />
                      <p>
                        Deadline :{" "}
                        {projectInfo?.project.dueDate
                          ? moment(projectInfo?.project.dueDate).format(
                              "DD-MMM-YYYY"
                            )
                          : " N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <CustomProgressBar
              // value={getProjectProgress(projectInfo?.project?.milestoneCount)}
              value={getProjectProgress(projectInfo?.tasksCount)}

              // stepCount={projectInfo?.project?.milestones?.length??0}
            />

            <div className={classes.btnBar}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <BtnWrapper>
                  <CustomButton
                    onClick={() => {
                      if (location?.pathname.split("/")?.length === 5) {
                        push(
                          `/main/projects/${location?.pathname.split("/")[3]}`
                        );
                        // setShowMilestone(location?.pathname.split("/")[4] !== "" ? false : true);
                        // setMilestoneId(location?.pathname.split("/")[4]);
                        clearFilter();
                      }
                      handleProjectInfoNav(0);
                    }}
                    type={projectInfoNav === 0 ? "contained" : "text"}
                    color="#f29726"
                    fontSize={16}
                  >
                    <FlagIcon style={{ fontSize: 20 }} />
                    <p style={{ marginLeft: 5 }}>Milestones</p>
                  </CustomButton>
                  {projectInfo?.project?.projectType !== "MARKETING" && (
                    <CustomButton
                      onClick={() => handleProjectInfoNav(1)}
                      fontSize={16}
                      type={projectInfoNav === 1 ? "contained" : "text"}
                      color="#f29726"
                    >
                      <BugReportIcon style={{ fontSize: 20 }} />
                      <p style={{ marginLeft: 5 }}>Bugs</p>
                    </CustomButton>
                  )}

                  <CustomButton
                    onClick={() => handleProjectInfoNav(2)}
                    fontSize={16}
                    type={projectInfoNav === 2 ? "contained" : "text"}
                  >
                    <InsertDriveFileIcon style={{ fontSize: 20 }} />
                    <p style={{ marginLeft: 5 }}>Files</p>
                  </CustomButton>

                  <CustomButton
                    onClick={() => handleProjectInfoNav(3)}
                    // style={{ marginRight: "10px" }}
                    fontSize={16}
                    type={projectInfoNav === 3 ? "contained" : "text"}
                  >
                    <LockOutlinedIcon style={{ fontSize: 20 }} />
                    <p style={{ marginLeft: 5 }}>Credentials</p>
                  </CustomButton>

                  <CustomButton
                    onClick={() => handleProjectInfoNav(4)}
                    // style={{ marginRight: "10px" }}
                    fontSize={16}
                    type={projectInfoNav === 4 ? "contained" : "text"}
                  >
                    <ForumOutlinedIcon style={{ fontSize: 20 }} />
                    <p style={{ marginLeft: 5 }}>Queries</p>
                  </CustomButton>
                  {userType?.userType === "Admin" && (
                    <CustomButton
                      onClick={() => handleProjectInfoNav(5)}
                      // style={{ marginRight: "10px" }}
                      fontSize={16}
                      type={projectInfoNav === 5 ? "contained" : "text"}
                    >
                      <ForumOutlinedIcon style={{ fontSize: 20 }} />
                      <p style={{ marginLeft: 5 }}>Payment Phase</p>
                    </CustomButton>
                  )}
                </BtnWrapper>
                {(!mileStoneEditDisable(userType, projectInfo) ||
                  (projectInfoNav === 4 &&
                    ["Admin", "Member++", "Member+"].includes(
                      userType?.userType
                    ))) &&
                  (projectInfoNav === 2 ||
                    projectInfoNav === 3 ||
                    projectInfoNav === 4 ||
                    projectInfoNav === 5) &&
                  (!showAddMilestone ? (
                    <LightTooltip
                      disableFocusListener={true}
                      arrow
                      title={addButtonToolTipText(projectInfoNav)}
                    >
                      <div className={classes.iconWrapper}>
                        <IconButton
                          onClick={() => setShowAddMilestone(!showAddMilestone)}
                        >
                          <AddIcon
                            style={{
                              // marginLeft: "10px",
                              color: "var(--defaultWhite)",
                              fontSize: 26,
                            }}
                            type={"contained"}
                          />
                        </IconButton>
                      </div>
                    </LightTooltip>
                  ) : (
                    <div>
                      <LightTooltip
                        title={"Cancel"}
                        disableFocusListener={true}
                        arrow
                      >
                        <div className={classes.iconWrapper}>
                          <IconButton
                            onClick={() =>
                              setShowAddMilestone(!showAddMilestone)
                            }
                          >
                            <CloseIcon
                              style={{
                                color: "var(--defaultWhite)",
                                fontSize: 26,
                              }}
                              type={"contained"}
                            />
                          </IconButton>
                        </div>
                      </LightTooltip>
                    </div>
                  ))}
              </div>

              <div className="alignCenter flex justifyContent_end">
                {projectInfoNav === 0 &&
                  projectInfo?.project?.projectType !== "MARKETING" && (
                    <>
                      <LightTooltip arrow title="Table">
                        <div
                          className="cursorPointer"
                          onClick={() => setViewType("table")}
                        >
                          <TableRowsIcon
                            style={{
                              color:
                                viewType === "table"
                                  ? "var(--progressBarColor)"
                                  : "#FFF",
                            }}
                          />
                        </div>
                      </LightTooltip>
                      <LightTooltip arrow title="Kanban View">
                        <div
                          className="cursorPointer"
                          onClick={() => setViewType("kanban")}
                        >
                          <AppsSharpIcon
                            style={{
                              color:
                                viewType === "kanban"
                                  ? "var(--progressBarColor)"
                                  : "#FFF",
                            }}
                          />
                        </div>
                      </LightTooltip>
                    </>
                  )}
              </div>

              {(projectInfoNav === 0 || projectInfoNav === 1) &&
                (viewType !== "kanban" ||
                  (location?.pathname.split("/")?.length === 5
                    ? true
                    : false)) && (
                  <CustomPopper
                    zIndex={999}
                    paperClassName={ProfilePopupCss.paperClass}
                    innerPopper={ProfilePopupCss.popperClassColor}
                    width="auto"
                    value={
                      <LightTooltip title="Filter">
                        <div
                          style={{
                            position: "relative",
                          }}
                        >
                          {filterCount() > 0 && (
                            <div className="filterBatch">
                              <p>{filterCount()}</p>
                            </div>
                          )}

                          <FilterListIcon
                            style={{
                              color: "var(--defaultWhite)",
                              fontSize: 35,
                            }}
                          />
                        </div>
                      </LightTooltip>
                    }
                    maxWidth={1200}
                    valueStyle={{
                      display: "flex",
                      fontSize: 14,
                      color: "white",
                      margin: "0px 20px",
                    }}
                    content={
                      <FilterInProject
                        type={projectInfoNav !== 0 ? "bug" : "milestone"}
                        bugsPlatform={bugPlatform}
                        projectInfo={projectInfo?.project}
                        orgId={orgId}
                        projectId={props?.match?.params?.id}
                        setFilter={setFilter}
                        filter={filter}
                        team={team}
                        platforms={[
                          ...(projectInfo?.project?.platforms
                            ? projectInfo?.project?.platforms
                            : []),
                          "Un-categorized",
                        ]}
                        // priority={["Low", "Medium", "High"]}
                        // status={["Not Started", "Active", "Completed"]}
                        // developerStatus={["Solved", "Pending"]}
                        testerStatus={["Review Pending", "Solved", "Approved"]}
                        filterCount={filterCount()}
                        clearFilter={clearFilter}
                        platformIds={platformIds}
                      />
                    }
                  />
                )}

              {projectInfoNav === 4 && (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <BtnWrapper>
                    <CustomButton
                      type={queryStatus === "Close" ? "text" : "contained"}
                      onClick={() => setQueryStatus("Open")}
                    >
                      <p>Open</p>
                    </CustomButton>
                    <CustomButton
                      type={queryStatus === "Open" ? "text" : "contained"}
                      onClick={() => setQueryStatus("Close")}
                    >
                      <p>Close</p>
                    </CustomButton>
                  </BtnWrapper>
                </div>
              )}
            </div>
          </>
        )}

        <CustomSideBar show={showInfo} toggle={showInfoToggle}>
          <ProjectInfoSidebar
            info={projectInfo?.project}
            team={team}
            disabled={mileStoneEditDisable(userType, projectInfo)}
          />
        </CustomSideBar>
      </div>
      <div className="px-2 pb-2 tableContainer">
        {projectInfoNav === 0 && (
          <Milestone
            showAddMilestone={showAddMilestone}
            projectId={props?.match?.params?.id}
            setShowAddMilestone={setShowAddMilestone}
            platforms={projectInfo?.project?.platforms}
            projectInfo={projectInfo?.project}
            isSelected={isSelected}
            multiSelection={multiSelection}
            filter={filter}
            team={team}
            disabled={mileStoneEditDisable(userType, projectInfo)}
            viewType={viewType}
            clearFilter={clearFilter}
          />
        )}
        {projectInfoNav === 1 && (
          <Bugs
            projectId={props?.match?.params?.id}
            platforms={bugPlatform}
            projectInfo={projectInfo?.project}
            isSelected={isSelected}
            multiSelection={multiSelection}
            filter={filter}
            team={team}
            disabled={mileStoneEditDisable(userType, projectInfo)}
            viewType={viewType}
            orgId={orgId}
          />
        )}

        {projectInfoNav === 2 && (
          <ProjectAttachment
            projectId={props?.match?.params?.id}
            orgId={orgId}
            showAddFolder={showAddMilestone}
            setShowAddFolder={setShowAddMilestone}
            disabled={mileStoneEditDisable(userType, projectInfo)}
            // platforms={bugPlatform}
            // projectInfo={projectInfo?.project}
            // isSelected={isSelected}
            // multiSelection={multiSelection}
            // filter={filter}
          />
        )}
        {projectInfoNav === 3 && (
          <Credentials
            projectId={props?.match?.params?.id}
            orgId={orgId}
            showAddCredentials={showAddMilestone}
            setShowAddCredentials={setShowAddMilestone}
            projectCredentials={projectInfo?.project?.credentials}
            disabled={mileStoneEditDisable(userType, projectInfo)}
          />
        )}
        {projectInfoNav === 4 && (
          <Queries
            projectId={props?.match?.params?.id}
            orgId={orgId}
            showAddQuery={showAddMilestone}
            setShowAddQuery={setShowAddMilestone}
            disabled={mileStoneEditDisable(userType, projectInfo)}
            queryStatus={queryStatus}
          />
        )}

        {projectInfoNav === 5 && userType?.userType === "Admin" && (
          <PaymentPhase
            projectId={props?.match?.params?.id}
            orgId={orgId}
            showAddPhase={showAddMilestone}
            setShowAddPhase={setShowAddMilestone}
            // disabled={mileStoneEditDisable(userType, projectInfo)}
            // queryStatus={queryStatus}
          />
        )}
      </div>
      <BottomActionBar
        isSelected={isSelected}
        onClose={() => setIsSelected([])}
        onDelete
        data={
          projectInfoNav !== 0
            ? {
                data: {
                  bugs: isSelected,
                },
                projectId: props?.match?.params?.id,
                orgId: orgId,
                platforms: bugPlatform,
                onToggle: () => {
                  setIsSelected([]);
                },
              }
            : {
                data: {
                  tasks: isSelected,
                },
                projectId: props?.match?.params?.id,
                orgId: orgId,
                milestoneIds: milestoneIds,
                onToggle: () => {
                  setIsSelected([]);
                },
              }
        }
        mutate={projectInfoNav !== 0 ? mutateDeleteBug : deleteTaskMutate}
        isLoading={
          projectInfoNav !== 0 ? isDeleteBugLoading : isDeleteTaskLoading
        }
      />
    </>
  );
}

const getProjectProgress = (milestoneCount) => {
  // if (!milestoneCount) {
  //   return 0;
  // } else if (!milestoneCount.Completed) {
  //   return 0;
  // } else {
  //   let denominator =
  //     (milestoneCount.Active ?? 0) +
  //     (milestoneCount?.NotStarted ?? 0) +
  //     milestoneCount?.Completed;
  //   return (milestoneCount?.Completed / denominator) * 100;
  // }
  if (!milestoneCount) {
    return 0;
  } else if (!milestoneCount.completedTasks) {
    return 0;
  } else {
    let denominator = milestoneCount?.tasksTotal ?? 0;
    return (milestoneCount?.completedTasks / denominator) * 100;
  }
};

const addButtonToolTipText = (id) => {
  switch (id) {
    case 0:
      return "Add Milestone";
    case 2:
      return "Add Folder";
    case 3:
      return "Add Credentials";
    default:
      return "Add";
  }
};
