import BottomActionBar from "components/bottomActionBar/BottomActionBar";
import CustomAvatar from "components/CustomAvatar";
import CustomPopper from "components/CustomPopper";
import NoData from "components/NoData";
import { LightTooltip } from "components/tooltip/LightTooltip";
import "css/Milestone.css";
import { useState } from "react";
import { useDeleteTaskBug } from "react-query/bugs/taskBugs/useDeleteTaskBug";
import { useTaskBugs } from "react-query/bugs/taskBugs/useTaskBugs";
import { useUpdateTaskBug } from "react-query/bugs/taskBugs/useUpdateTaskBug";
import { useSelector } from "react-redux";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import classes from "./Bug.module.css";
import BugRowItem from "./BugRowItem";
import ProfilePopupCss from "css/ProfilePopup.module.css";
import FilterInProject from "../FilterInProject";
import { useProjectTeam } from "hooks/useUserType";
import { useCallback } from "react";

import FilterListIcon from "@material-ui/icons/FilterList";
import moment from "moment";

const filterCount = (filter) => {
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
  filterCount += count;
  return filterCount;
};

function TaskBugs({ match }) {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { data, isLoading, isError } = useTaskBugs({
    projectId: match.params.projectId,
    taskId: match.params.taskId,
    orgId,
  });
  const [isSelected, setIsSelected] = useState([]);

  const onHandleSelect = (id) => {
    const newSelected = [...isSelected];
    if (newSelected.includes(id)) {
      newSelected.splice(newSelected.indexOf(id), 1);
    } else {
      newSelected.push(id);
    }
    setIsSelected(newSelected);
  };
  const { mutate } = useUpdateTaskBug({
    orgId,
    projectId: match.params.projectId,
    taskId: match.params.taskId,
  });
  const { mutateDeleteBug, isDeleteBugLoading } = useDeleteTaskBug();
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
  const { bugsPlatforms, project, team } = useProjectTeam();
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
  return (
    <div className="p-2">
      {isError ? (
        <NoData error />
      ) : (
        <div>
          <div className="d_flex justifyContent_end mb-2">
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
                    {filterCount(filter) > 0 && (
                      <div className="filterBatch">
                        <p>{filterCount(filter)}</p>
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
                  type={"bug"}
                  bugsPlatform={bugsPlatforms}
                  projectInfo={project}
                  orgId={orgId}
                  projectId={match?.params?.projectId}
                  setFilter={setFilter}
                  filter={filter}
                  team={team}
                  platforms={[
                    ...(project?.platforms ? project?.platforms : []),
                    "Un-categorized",
                  ]}
                  // priority={["Low", "Medium", "High"]}
                  // status={["Not Started", "Active", "Completed"]}
                  // developerStatus={["Solved", "Pending"]}
                  testerStatus={["Review Pending", "Solved", "Approved"]}
                  filterCount={filterCount(filter)}
                  clearFilter={clearFilter}
                  // platformIds={platformIds}
                />
              }
            />
          </div>

          <div className="milestoneContainer" style={{ height: "auto" }}>
            <div
              className={`${classes.bugRow1} ralewaySemiBold`}
              style={{
                position: "sticky",
                zIndex: 2,
                backgroundColor: true ? "#343760" : "var(--projectCardBg)",
              }}
            >
              <div className={classes.icon}></div>

              <div className="flex">
                <div className="d_flex alignCenter" style={{ color: "#FFF" }}>
                  <p>Issues</p>
                </div>
              </div>

              <div></div>
              <div></div>
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
                    <CustomAvatar title="Created By" />

                    <p style={{ width: 10, margin: "0px 10px" }}>|</p>
                    <div className="d_flex">
                      <CustomAvatar title="Assignees" />
                    </div>
                  </div>
                </div>
                <div className="milestone_cell ">Bug Status</div>
                <div className="milestone_cell ">Priority</div>
                <div className="milestone_cell ">Created On</div>
              </>
            </div>
          </div>
          {isLoading ? (
            <TableRowSkeleton count={4} />
          ) : filter?.assigneeIds?.length ||
            filter?.[data?.id]?.length ||
            filter?.priority?.length ||
            filter?.bugStatus?.length ||
            filter?.date?.length ||
            filter?.bugTaskIds?.length ||
            filter?.platforms?.length 
            ? (
            data?.map(
              (row, i) =>
                (row?.assignees?.filter((item) =>
                  filter?.assigneeIds?.includes(item?._id)
                ).length > 0 ||
                  filter?.priority?.includes(row?.priority) ||
                  filter?.bugStatus?.includes(row?.status) ||
                  filter?.testerStatus?.includes(row?.testerStatus) ||
                  filter?.bugTaskIds?.includes(row?.task?.[0]?._id) ||
                  filter?.[data?.id]?.includes(row?.section) ||
                  filter?.platforms?.includes(row?.platform) ||

                  dateFilterRender({
                    date:row?.createdAt,
                    filterDate:filter?.date,
                  })) && (
                  <BugRowItem
                    item={row}
                    isSelected={isSelected}
                    onHandleSelect={onHandleSelect}
                    taskId={match.params.taskId}
                    mutate={mutate}
                    orgId={orgId}
                    key={row?._id}
                  />
                )
            )
          ) : (
            data?.map((row, i) => (
              <BugRowItem
                item={row}
                isSelected={isSelected}
                onHandleSelect={onHandleSelect}
                taskId={match.params.taskId}
                mutate={mutate}
                orgId={orgId}
                key={row?._id}
              />
            ))
          )}
        </div>
      )}

      <BottomActionBar
        isSelected={isSelected}
        onClose={() => setIsSelected([])}
        onDelete
        data={{
          data: {
            bugs: isSelected,
          },
          projectId: match?.params?.projectId,
          taskId: match?.params?.taskId,
          orgId: orgId,
          onToggle: () => {
            setIsSelected([]);
          },
        }}
        mutate={mutateDeleteBug}
        isLoading={isDeleteBugLoading}
      />
    </div>
  );
}

export default TaskBugs;

const dateFilterRender = ({ date, filterDate }) => {
  if (date === undefined) {
    return false;
  } else {
    switch (filterDate) {
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
