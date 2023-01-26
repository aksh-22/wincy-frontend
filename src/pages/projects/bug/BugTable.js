import React, { useState } from "react";
import "css/Milestone.css";
import Checkbox from "@material-ui/core/Checkbox";
import { ClickAwayListener } from "@material-ui/core";
import { useBugs } from "react-query/bugs/useBugs";
import { useSelector } from "react-redux";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import CommonDialog from "components/CommonDialog";
import AddBugModal from "./AddBugModal";
import CustomSideBar from "components/customSideBar/CustomSideBar";
import BugInfoSidebar from "./BugInfoSidebar";
import CustomMenu from "components/CustomMenu";
import { useUpdateBug } from "react-query/bugs/useUpdateBug";
import { LightTooltip } from "components/tooltip/LightTooltip";
import { addSpaceUpperCase } from "utils/addSpaceUpperCase";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import classes from "./Bug.module.css";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import InfoIcon from "components/icons/InfoIcon";
import { useSection } from "react-query/bugs/useSection";
import { useCallback } from "react";
import Loading from "components/loading/Loading";
import moment from "moment";
import Image from "components/defaultImage/Image";
import CustomAvatar from "components/CustomAvatar";
import { bugStatus, getBugStatusFunction, priorityArray } from "utils/status";
import { previousDateFunction } from "../../../utils/status";
import { useProjectTeam } from "hooks/useUserType";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
import Icon from "components/icons/IosIcon";

// import SectionAutoComplete from './SectionAutoComplete'
export const checkUserAuth = (bug, userId, actionDisabled) => {
  let assignee =
    bug?.assignees?.filter((item) => item?._id === userId)?.length > 0
      ? true
      : false;
  let createdBy = Array.isArray(bug?.createdBy)
    ? bug?.createdBy?.[0]?._id === userId
    : bug?.createdBy?._id === userId;
  let adminAccess = !actionDisabled;
  return assignee || createdBy || adminAccess ? false : true;
};

export const checkEditAccess = (userId, row, actionDisabled) => {
  let isCreator = row?.createdBy?.[0]?._id !== userId;
  let isAdminAccess = !actionDisabled;
  if (isAdminAccess) {
    return false;
  }
  return isCreator;
};

function BugTable({
  data,
  projectId,
  projectInfo,
  multiSelection,
  isSelected,
  filter,
  team,
  disabled,
  count,
  isBugCountLoading,
}) {
  const { actionDisabled } = useProjectTeam();
  // State
  const [collapsible, setCollapsible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState([]);
  const [pageNo] = useState(1);
  const [activeBug, setActiveBug] = useState(null);
  const [currentBug, setCurrentBug] = useState("");
  const [editEnable, setEditEnable] = useState(null);
  const [currentlyEditingMenu, setCurrentlyEditingMenu] = useState(null);

  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const userId = useSelector((state) => state.userReducer?.userData?.user?._id);
  const userType = useSelector(
    (state) => state.userReducer?.userType?.userType
  );
  const [updateBug, setUpdateBug] = useState({
    title: "",
  });

  const [showInfo, setShowInfo] = useState(false);
  const toggleShowInfo = () => {
    setShowInfo(!showInfo);
  };

  const { mutateUpdateBug } = useUpdateBug(
    orgId,
    projectId,
    data?.name,
    pageNo,
    null,
    setCurrentlyEditingMenu,
    setEditEnable,
    activeBug?.name
  );

  const { isLoading, data: bugData } = useBugs(
    orgId,
    projectId,
    data?.name,
    pageNo
  );
  const { data: sectionData } = useSection(orgId, projectId, activeBug?.id);

  const handleActiveBug = (item) => {
    setActiveBug(item);
  };

  const heightCalculate = (length) => {
    if (isLoading) {
      return 2 * 100;
    }
    // return (length ?? 0) * 30 + 100;
    return "auto";
  };

  const insertRow_id = (id) => {
    if (currentIndex.includes(id)) {
      setCollapsible(false);
      setCurrentIndex(currentIndex.filter((item) => item !== id));
    } else {
      setCollapsible(true);
      //   setCurrentMilestoneId(id);
      setCurrentIndex([...currentIndex, id]);
    }
  };

  // Update Bug Functions
  // const updateBug = () => {};
  const onSubmitUpdateBug = (rowId, rowValue) => {
    // alert('a');
    let data = {};
    if (rowValue === "title") {
      setCurrentlyEditingMenu("title");
      data["title"] = updateBug?.title;
    }

    let sendData = {
      orgId: orgId,
      bugId: rowId ?? editEnable,
      data: data,
    };
    updateBug?.title?.length > 0 && mutateUpdateBug(sendData);
    setUpdateBug({});
    setEditEnable(false);
  };

  const handlePriority = (bugId) => (selectedMenuItem) => {
    let data = {
      priority: selectedMenuItem?.value,
    };
    setCurrentlyEditingMenu("priority");

    let sendData = {
      orgId: orgId,
      bugId: bugId,
      data: data,
    };
    selectedMenuItem?.value && mutateUpdateBug(sendData);
  };

  const handleTesterStatus = (bugId) => (selectedMenuItem) => {
    let data = {
      status: selectedMenuItem.value,
    };
    setCurrentlyEditingMenu("testerStatus");

    let sendData = {
      orgId: orgId,
      bugId: bugId,
      data: data,
    };
    selectedMenuItem.value !== undefined && mutateUpdateBug(sendData);
  };

  const handleAssigneeUpdate = useCallback(
    ({ otherId, assigneeData, assigneeId, teamData, teamIds }) => {
      mutateUpdateBug({
        orgId: orgId,
        bugId: otherId,
        data: {
          assignees: teamIds ?? "",
        },
        additionalInfo: {
          assignees: teamData,
        },
      });
    },
    []
  );

  const bugTableRender = (row, i) => {
    return (
      <div
        key={row?._id}
        className={`${classes.bugRow2}  ${
          row?.testerStatus === "Approved" ? "completedRow" : ""
        } `}
        style={{ opacity: row?._id === "localData" ? 0.3 : 1 }}
      >
        <div
          className={`subMilestone_sideLine d_flex alignCenter ${
            isSelected.length !== 0 ? "rowSelected" : ""
          }  ${editEnable === row?._id ? "backgroundChangeOnEdit" : ""} ${
            userId !== row?.createdBy?.[0]?._id && "cursorNotAllowed"
          }  ${row?.testerStatus === "Approved" ? "completedRowSideLine" : ""}`}
          style={
            {
              // backgroundColor: `rgb(${data?.color})`,
            }
          }
        >
          <Checkbox
            size="small"
            checked={isSelected.includes(row?._id)}
            onClick={() => multiSelection(row?._id)}
            // disabled={userId !== row?.createdBy?.[0]?._id}
            disabled={checkEditAccess(userId, row, actionDisabled)}
          />
        </div>
        <div className={`alignCenter d_flex pr-1`}>
          <LightTooltip
            title={`${projectInfo?.title?.substring(0, 3)}#${row?.sNo}`}
          >
            <p className="date" style={{ textTransform: "uppercase" }}>
              {projectInfo?.title?.substring(0, 3)?.toLowerCase()}#{row?.sNo}
            </p>
          </LightTooltip>
        </div>

        {editEnable === row?._id ? (
          <ClickAwayListener onClickAway={() => setEditEnable(false)}>
            <input
              type="text"
              name="title"
              defaultValue={row?.title}
              // className="sm-transparent-input"
              style={{ flex: 1 }}
              className={`${classes.milestone_input_text} px-2`}
              placeholder="+ Add"
              autoFocus
              // maxLength="70"
              // value={addTaskData.title}

              onChange={(e) => {
                setUpdateBug({
                  [e.target.name]: e.target.value,
                });
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  onSubmitUpdateBug(row?._id, "title");
                }
              }}
            />
          </ClickAwayListener>
        ) : (
          <div className="alignCenter textEllipse ">
            <LightTooltip title={"" ?? row?.title}>
              <p
                className="textEllipse  flex"
                style={{
                  width: "100%",
                  overflow: "hidden",
                  cursor: checkEditAccess(userId, row, actionDisabled)
                    ? "default"
                    : "text",
                }}
                onClick={() => {
                  !checkEditAccess(userId, row, actionDisabled) &&
                    setEditEnable(row?._id);
                }}
              >
                {row?.title}
              </p>
            </LightTooltip>

            {row?.description && (
              <LightTooltip title="Description" arrow>
                <div
                  className="mx-1 cursorPointer"
                  onClick={() => {
                    row?._id !== "localData" && setCurrentBug(i);
                    toggleShowInfo();
                  }}
                >
                  <Icon name="menu" />
                </div>
              </LightTooltip>
            )}

            {row?.attachments?.length > 0 && (
              <LightTooltip
                title={`${row?.attachments?.length} Attachment(s)`}
                arrow
              >
                <div
                  className="alignCenter mr-1 cursorPointer"
                  onClick={() => {
                    row?._id !== "localData" && setCurrentBug(i);
                    toggleShowInfo();
                  }}
                >
                  <AttachFileRoundedIcon
                    style={{
                      fontSize: 16,
                      color: "#8a9aff",
                    }}
                  />
                  {/* <p
          style={{
            fontSize:12
          }}
          >{row?.attachments?.length}</p> */}
                </div>
              </LightTooltip>
            )}

            {row?.comments?.length > 0 && (
              <LightTooltip title="Comment" arrow>
                <div
                  className="alignCenter mr-1 cursorPointer"
                  onClick={() => {
                    row?._id !== "localData" && setCurrentBug(i);
                    toggleShowInfo();
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
        )}

        <div className="alignCenter">
          <InfoIcon
            onClick={() => {
              row?._id !== "localData" && setCurrentBug(i);
              toggleShowInfo();
            }}
            className="cursorPointer"
          />
        </div>
        <div
          className="d_flex alignCenter"
          style={{ width: "100%", padding: "0px 15px" }}
        >
          <div className="d_flex alignCenter ">
            <Image
              type="createdBy"
              src={
                Array.isArray(row?.createdBy)
                  ? row?.createdBy?.[0]?.profilePicture
                  : row?.createdBy?.profilePicture
              }
              title={
                Array.isArray(row?.createdBy)
                  ? row?.createdBy?.[0]?.name
                  : row?.createdBy?.name
              }
            />
            <p style={{ width: 10, margin: "0px 10px" }}>|</p>{" "}
          </div>
          <div className="flex d_flex ">
            <AssigneeSelection
              team={team}
              assignee={row?.assignees}
              onChange={handleAssigneeUpdate}
              otherId={row?._id}
              disabled={checkUserAuth(row, userId, actionDisabled)}
              multiple
              needOneMember={true}
            />
          </div>
        </div>
        <div
          className={`subMilestone_priority milestone_cell border_solid_bottom border_solid_left `}
        >
          <CustomMenu
            menuItems={getBugStatusFunction(row?.status??"Open")}
            id={row?._id}
            mutate={row?.mutate}
            menuName="bugStatus"
            handleMenuClick={handleTesterStatus(row._id)}
            name={currentlyEditingMenu}
            activeMenuItem={addSpaceUpperCase(row?.status??"Open")}
            disabled={checkUserAuth(row, userId, actionDisabled)}
          />
        </div>
        <div
          className={`subMilestone_assignee milestone_cell border_solid_bottom border_solid_left`}
        >
          <CustomMenu
            menuItems={priorityArray}
            id={row?._id}
            name={currentlyEditingMenu}
            mutate={row?.mutate}
            disabled={
              !actionDisabled ? false : userId !== row?.createdBy?.[0]?._id
            }
            handleMenuClick={handlePriority(row._id)}
            activeMenuItem={addSpaceUpperCase(row?.priority)}
          />
        </div>
        <div style={{ textAlign: "center" }}>
          {row?.createdAt ? previousDateFunction(row?.createdAt) : "N/A"}
        </div>
      </div>
    );
  };

  const dateFilterRender = (date) => {
    if (date === undefined) {
      return false;
    } else {
      switch (filter?.date) {
        case "Today": {
          if (Math.abs(moment(date).diff(new Date(), "days")) === 0) {
            return true;
          } else {
            return false;
          }
        }
        case "Tomorrow": {
          if (Math.abs(moment(date).diff(new Date(), "days")) === -1) {
            return true;
          } else {
            return false;
          }
        }
        case "Last 7 Days": {
          if (Math.abs(moment(date).diff(new Date(), "days")) >= -7) {
            return true;
          } else {
            return false;
          }
        }
        default:
          return false;
      }
      // return true
    }
  };

  const bugTableMap = (bugData) => {
    const {
      bugStatus,
      assigneeIds,
      testerStatus,
      priority,
      platforms,
      date,
      bugTaskIds,
    } = filter;
    return assigneeIds?.length ||
      filter?.[data?.id]?.length ||
      priority?.length ||
      bugStatus?.length ||
      date?.length ||
      bugTaskIds?.length
      ? bugData?.bugs?.map(
          (row, i) =>
            (row?.assignees?.filter((item) => assigneeIds?.includes(item?._id))
              .length > 0 ||
              priority?.includes(row?.priority) ||
              bugStatus?.includes(row?.status??"Open") ||
              testerStatus?.includes(row?.testerStatus) ||
              bugTaskIds?.includes(row?.task?.[0]?._id) ||
              filter?.[data?.id]?.includes(row?.section) ||
              dateFilterRender(row?.createdAt)) &&
            bugTableRender(row, i)
        )
      : bugData?.bugs?.map((row, i) => bugTableRender(row, i));
  };
  return (
    <div
      className="milestoneContainer mb-2"
      style={{
        height: collapsible ? heightCalculate(bugData?.bugs?.length) : 70,
      }}
    >
      {/* // Table Head */}

      <div
        className={`${classes.bugRow1} ralewaySemiBold`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          insertRow_id(data?.name);
          handleActiveBug(data);
        }}
        style={{
          position: "sticky",
          zIndex: 2,
          // top: 68,
          backgroundColor:
            collapsible === true ? "#343760" : "var(--projectCardBg)",
          // backgroundColor: `rgb(${data?.color})`,
        }}
      >
        <div className={classes.icon}>
          <ArrowRightIcon
            className={`milestone_arrowContainer ${
              currentIndex.includes(data?.name)
                ? "milestone_arrowContainer_90degree"
                : ""
            }`}
            style={{ color: "#FFF" }}
          />
        </div>
        {/* <div className={`arrowContainer`}>
        </div> */}

        <div className="flex">
          <div className="d_flex alignCenter" style={{ color: "#FFF" }}>
            <p>{data?.name}</p>

            {/* { collapsible &&  <div onClick={(e) => {
              e.preventDefault();
              e.stopPropagation()
            }}>
             <SectionAutoComplete />
            </div>} */}
          </div>
        </div>
        {/* <div className="d_flex alignCenter justifyContent-end ">
          <InfoOutlinedIcon />
        </div> */}
        {/* <div className="milestone_cell "> */}
        {/* <InfoIcon /> */}
        {/* </div> */}
        {/* <div></div> */}
        <div></div>
        <div></div>
        {collapsible ? (
          <>
            <div className="milestone_cell ">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  padding: "0px 15px",
                }}
              >
                {/* Assignee */}
                <CustomAvatar title="Created By" />

                <p style={{ width: 10, margin: "0px 10px" }}>|</p>
                <div className="d_flex">
                  <CustomAvatar title="Assignees" />
                  {/* <CustomAvatar title="Assignee" style={{marginLeft : "-13px" }}/> */}
                </div>
              </div>
            </div>
            <div className="milestone_cell ">Bug Status</div>
            <div className="milestone_cell ">Priority</div>
            <div className="milestone_cell ">Created On</div>
          </>
        ) : (
          <>
            <div></div>
            <div></div>
            <div></div>
            {isBugCountLoading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginRight: 30,
                }}
              >
                <Loading />
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {count && (
                  <p style={{ marginRight: 10 }}>
                    {count?.done ?? 0}/{count?.total ?? 0}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
      {
        // SubTable
      }

      <div
        className={`milestone_subContainer  normalFont ${
          collapsible ? "activeABC" : ""
        }`}
      >
        {currentIndex?.includes(data?.name) &&
          (isLoading ? (
            <TableRowSkeleton count={2} />
          ) : (
            <>
              <div className={classes.addRow}>
                <div
                  className={`subMilestone_sideLine `}
                  // style={{backgroundColor:"var(--progressBarColor)"}}
                ></div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <CommonDialog
                    actionComponent={<AddBugLine />}
                    modalTitle="Add Bug"
                    content={
                      <AddBugModal
                        platform={data?.name}
                        platformId={data?.id}
                        projectInfo={projectInfo}
                        pageNo={pageNo}
                        team={team}
                        orgId={orgId}
                        sectionsArr={sectionData ?? []}
                      />
                    }
                    width="100%"
                    height={300}
                    dialogContentClass={"pt-0"}
                    maxWidth={700}
                    // size="md"
                  />

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

              {bugTableMap(bugData)}
            </>
          ))}
      </div>
      {
        <CustomSideBar toggle={toggleShowInfo} show={showInfo}>
          <BugInfoSidebar
            bug={bugData?.bugs[currentBug]}
            projectInfo={projectInfo}
            platform={activeBug?.id}
            pageNo={pageNo}
            activeBug={activeBug}
            // disabled={userId !== bugData?.bugs[currentBug]?.createdBy?.[0]?._id}
            developerEditEnable={
              Array.isArray(bugData?.bugs[currentBug]?.assignee)
                ? bugData?.bugs[currentBug]?.assignee?.[0]?._id !== userId
                : bugData?.bugs[currentBug]?.assignee?._id !== userId
            }
            team={team}
            // sectionData={sectionData ?? []}
            disabled={checkEditAccess(
              userId,
              bugData?.bugs[currentBug],
              actionDisabled
            )}
            secondDisable={checkUserAuth(
              bugData?.bugs[currentBug],
              userId,
              actionDisabled
            )}
          />
        </CustomSideBar>
      }
    </div>
  );
}

export default BugTable;

function AddBugLine({ onClick }) {
  return (
    <p
      onClick={onClick}
      className={`${classes.addRow} pl-1`}
      style={{ flex: 1, cursor: "pointer", width: "100%" }}
    >
      + Add Bug
    </p>
  );
}
