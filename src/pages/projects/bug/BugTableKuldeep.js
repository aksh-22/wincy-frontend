import React, { useState } from "react";
import "css/Milestone.css";
import Checkbox from "@material-ui/core/Checkbox";
// import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { ClickAwayListener } from "@material-ui/core";
// import CustomAvatar from "components/CustomAvatar";
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
// import { infoToast } from "utils/toast";
// import CustomPopper from "components/CustomPopper";
// import BugAssignees from "./BugAssignees";
// import CustomButton from "components/CustomButton";
// import { useEffect } from "react";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import classes from "./Bug.module.css";
import AssigneeSelection from "components/assigneeSelection/AssigneeSelection";
import InfoIcon from "components/icons/InfoIcon";

const checkEditableRights = (userId, data, userType, disabled) => {
  let createdBy = userId !== data?.createdBy?._id;
  // let createdBy = false
  let assignee =
    data?.assignees?.filter((item) => item?._id === userId).length > 0
      ? false
      : true;

  return !assignee ? false : createdBy;
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
}) {
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
    activeBug?.id,
    pageNo,
    null,
    setCurrentlyEditingMenu,
    setEditEnable
  );

  const { isLoading, data: bugData } = useBugs(
    orgId,
    projectId,
    activeBug?.id,
    pageNo
  );

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
      priority: selectedMenuItem.value,
    };
    setCurrentlyEditingMenu("priority");

    let sendData = {
      orgId: orgId,
      bugId: bugId,
      data: data,
    };
    mutateUpdateBug(sendData);
  };

  const handleTesterStatus = (bugId) => (selectedMenuItem) => {
    let data = {
      testerStatus: selectedMenuItem.value,
    };
    setCurrentlyEditingMenu("testerStatus");

    let sendData = {
      orgId: orgId,
      bugId: bugId,
      data: data,
    };
    mutateUpdateBug(sendData);
  };

  const handleDeveloperStatus = (bugId) => (selectedMenuItem) => {
    let data = {
      developerStatus: selectedMenuItem.value,
    };
    setCurrentlyEditingMenu("developerStatus");

    let sendData = {
      orgId: orgId,
      bugId: bugId,
      data: data,
    };
    mutateUpdateBug(sendData);
  };

  const handleAssigneeUpdate = ({
    otherId,
    assigneeData,
    assigneeId,
    teamData,
    teamIds,
  }) => {
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
  };
  //  const handlePriority = (row?._id) => {

  //  }

  const bugTableRender = (row, i) => {
    return (
      <div
        key={row?._id}
        // className="d_flex  subMilestone_row  "
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
          style={{
            backgroundColor: `rgb(${data?.color})`,
          }}
        >
          <Checkbox
            size="small"
            checked={isSelected.includes(row?._id)}
            onClick={() => multiSelection(row?._id)}
            disabled={userId !== row?.createdBy?.[0]?._id}
          />
        </div>
        <div className={`alignCenter d_flex px-1`}>
          <LightTooltip
            title={`${projectInfo?.title?.substring(0, 3)}#${row?.sNo}`}
          >
            <p>
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
          <LightTooltip title={row?.title}>
            <p
              className="textEllipse"
              style={{ width: "100%", overflow: "hidden" }}
              onClick={() => {
                row?.createdBy?.[0]?._id === userId && setEditEnable(row?._id);
              }}
            >
              {row?.title}
            </p>
          </LightTooltip>
        )}
        <InfoIcon
          onClick={() => {
            row?._id !== "localData" && setCurrentBug(i);
            toggleShowInfo();
          }}
          className="cursorPointer"
        />
        <div className="d_flex alignCenter" style={{ margin: "auto" }}>
          {/* // change assignee here */}
          <AssigneeSelection
            team={team}
            assignee={row?.assignees}
            onChange={handleAssigneeUpdate}
            otherId={row?._id}
            disabled={checkEditableRights(userId, row, disabled)}
            // userId !== row?.createdBy?.[0]?._id}
            multiple
          />
          {/* {console.log(
            "checkEditableRights(userId ,row )",
            checkEditableRights(userId, row, disabled)
          )} */}
          {/* <CustomPopper
            disabled={userId !== row?.createdBy?._id}
            value={
              <CustomAvatar
                small
                src={row?.assignee?.profilePicture}
                title={row?.assignee?.name}
              />
            }
            content={
              <BugAssignees
                orgId={orgId}
                bugId={row?._id}
                projectInfo={projectInfo}
                currentAssignee={row?.assignee}
                pageNo={pageNo}
                platform={activeBug?.id}
              />
            }
            noHover={true}
          /> */}
        </div>

        {/* // change assignee here */}

        <div
          className={`subMilestone_priority milestone_cell border_solid_bottom border_solid_left `}
        >
          <CustomMenu
            menuItems={[
              {
                label: "Approved",
                value: "Approved",
                menuName: "testerStatus",
              },
              {
                label: "Pending",
                value: "Pending",
                menuName: "testerStatus",
              },
            ]}
            id={row?._id}
            mutate={row?.mutate}
            disabled={
              (
                Array.isArray(row?.createdBy)
                  ? row?.createdBy?.[0]?._id !== userId ||
                    row?.developerStatus === "Pending"
                  : row?.createdBy?._id !== userId ||
                    row?.developerStatus === "Pending"
              )
                ? true
                : false
            }
            handleMenuClick={handleTesterStatus(row._id)}
            name={currentlyEditingMenu}
            activeMenuItem={addSpaceUpperCase(row?.testerStatus)}
          />
        </div>
        <div
          style={{
            cursor: "pointer ",
          }}
          className={`subMilestone_platform milestone_cell border_solid_bottom border_solid_left`}
        >
          <CustomMenu
            menuItems={[
              {
                label: "Solved",
                value: "Solved",
                menuName: "developerStatus",
              },
              {
                label: "Pending",
                value: "Pending",
                menuName: "developerStatus",
              },
            ]}
            id={row?._id}
            mutate={row?.mutate}
            disabled={
              Array.isArray(row?.assignee)
                ? row?.assignee?.[0]?._id !== userId
                : row?.assignee?._id !== userId
            }
            handleMenuClick={handleDeveloperStatus(row._id)}
            name={currentlyEditingMenu}
            activeMenuItem={addSpaceUpperCase(row?.developerStatus)}
          />
        </div>
        <div
          className={`subMilestone_assignee milestone_cell border_solid_bottom border_solid_left`}
        >
          <CustomMenu
            menuItems={[
              { label: "Low", value: "Low", menuName: "priority" },
              {
                label: "Medium",
                value: "Medium",
                menuName: "priority",
              },
              { label: "High", value: "High", menuName: "priority" },
            ]}
            id={row?._id}
            name={currentlyEditingMenu}
            mutate={row?.mutate}
            disabled={!row?.createdBy?.[0]?._id === userId}
            handleMenuClick={handlePriority(row._id)}
            activeMenuItem={addSpaceUpperCase(row?.priority)}
          />
        </div>
      </div>
    );
  };

  const bugTableMap = (bugData) => {
    const { developerStatus, assigneeIds, testerStatus, priority, platforms } =
      filter;
    return assigneeIds?.length ||
      testerStatus?.length ||
      platforms?.length ||
      developerStatus?.length ||
      priority?.length
      ? bugData?.bugs?.map(
          (row, i) =>
            (assigneeIds?.includes(row?.assignee?._id) ||
              priority?.includes(row?.priority) ||
              developerStatus?.includes(row?.developerStatus) ||
              testerStatus?.includes(row?.testerStatus)) &&
            // ||
            // platforms?.includes(row?.platform)
            bugTableRender(row, i)
        )
      : bugData?.bugs?.map((row, i) => bugTableRender(row, i));
  };
  return (
    <div
      // key={data?.id}
      className="milestoneContainer mb-2"
      style={{
        height: collapsible ? heightCalculate(bugData?.bugs?.length) : 40,
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
          // backgroundColor: collapsible === true ? "#343760" : "transparent",
          backgroundColor: `rgb(${data?.color})`,
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
            {data?.name}
          </div>
        </div>
        {/* <div className="d_flex alignCenter justifyContent-end ">
          <InfoOutlinedIcon />
        </div> */}
        {/* <div className="milestone_cell "> */}
        {/* <InfoIcon /> */}
        {/* </div> */}
        <div></div>
        <div></div>
        <div></div>
        {collapsible ? (
          <>
            {" "}
            <div className="milestone_cell ">Assignee</div>
            <div className="milestone_cell ">Tester Status</div>
            <div className="milestone_cell ">Developer Status</div>
            <div className="milestone_cell ">Priority</div>{" "}
          </>
        ) : (
          <>
            <div></div>
            <div></div>
            <div></div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <p style={{ marginRight: 10 }}>Items : 6</p>
            </div>
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
                        platform={data?.id}
                        projectInfo={projectInfo}
                        pageNo={pageNo}
                        team={team}
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
            disabled={
              Array.isArray(bugData?.bugs[currentBug]?.createdBy)
                ? userId !== bugData?.bugs[currentBug]?.createdBy?.[0]?._id
                : userId !== bugData?.bugs[currentBug]?.createdBy?._id
            }
            developerEditEnable={
              Array.isArray(bugData?.bugs[currentBug]?.assignee)
                ? bugData?.bugs[currentBug]?.assignee?.[0]?._id !== userId
                : bugData?.bugs[currentBug]?.assignee?._id !== userId
            }
            team={team}
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
