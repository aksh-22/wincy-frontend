import React, { useState, useEffect } from "react";
import "./scss/Bugs.scss";
import MyworkBugTable from "./MyworkBugTable";
import { useMyWorkProjects } from "react-query/mywork/useMyWorkProjects";
import { useSelector } from "react-redux";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import CustomPopper from "components/CustomPopper";
import { LightTooltip } from "components/tooltip/LightTooltip";
import FilterListIcon from "@material-ui/icons/FilterList";
import FilterInProject from "pages/projects/FilterInProject";
import ProfilePopupCss from "css/ProfilePopup.module.css";
import NoData from "components/NoData";

function MyWorkBugs() {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const [filter, setFilter] = useState({
    projectIds: [],
    priority: [],
    developerStatus: [],
    testerStatus: [],
  });

  const clearFilter = () => {
    setFilter({
      projectIds: [],
      priority: [],
      developerStatus: [],
      testerStatus: [],
    })
  }
  const filterCount = () => {
    const {
      projectIds,
      priority,
      developerStatus,
      testerStatus
    } = filter;
    let filterCount =
      (projectIds.length ? 1 : 0) +
      (testerStatus?.length ? 1 : 0) +
      (developerStatus?.length ? 1 : 0) +
      (priority?.length ? 1 : 0) 

    return filterCount;
  };
  // console.log("MyWorkBugs 1 filter:", filter);

  const { myworkProjectsData, isMyWorkProjectsLoading, statusProject } =
    useMyWorkProjects(orgId);

  // console.log("projects:", myworkProjectsData);

  return (
    <div className="mywork_bugs_screen">
      {statusProject === "loading" ? (
        <TableRowSkeleton count={2} height={30} />
      ) : statusProject === "success" ? (
        myworkProjectsData.length === 0 ? (
        <div className="mytask"> 
           <NoData />
        </div>
        ) : (
          <>
            <div className="d_flex flex justifyContent_end">
              <CustomPopper
                zIndex={4}
                paperClassName={ProfilePopupCss.paperClass}
                innerPopper={ProfilePopupCss.popperClassColor}
                width="auto"
                value={
                  <LightTooltip title="Filter">
                      <div
                       style={{
                        position:"relative"
                      }}>
                        {
                          filterCount() > 0 && <div className="filterBatch">
                          <p>{filterCount()}</p>
                        </div>
                        }
                    <FilterListIcon
                      style={{
                        color: "var(--defaultWhite)",
                        fontSize: 35,
                      }}
                    />
                    </div>
                  </LightTooltip>
                }
                valueStyle={{
                  display: "flex",
                  fontSize: 14,
                  color: "white",
                  margin: "0px 20px",
                }}
                content={
                  <FilterInProject
                    type="bug"
                    // bugsPlatform={bugPlatform}
                    // projectInfo={projectInfo?.project}
                    // orgId={orgId}
                    // projectId={props?.match?.params?.id}
                    setFilter={setFilter}
                    filter={filter}
                    // team={team}
                    // platforms={[
                    //   ...(projectInfo?.project?.platforms
                    //     ? projectInfo?.project?.platforms
                    //     : []),
                    //   "Un-categorized",
                    // ]}
                    priority={["Low", "Medium", "High"]}
                    // status={["Not Started", "Active", "Completed"]}
                    developerStatus={["Solved", "Pending"]}
                    testerStatus={["Review Pending", "Pending", "Approved"]}
                    noPlatform
                    noAssignee
                    clearFilter={clearFilter}
                    filterCount={filterCount()}
                  />
                }
              />
            </div>

            {myworkProjectsData?.map((row, i) => {
              // console.log('myworkProjectsData row:',row)
              return (
                <MyworkBugTable
                  key={row?._id}
                  orgId={orgId}
                  projectInfo={row}
                  filter={filter}
                />
              );
            })}
          </>
        )
      ) : statusProject === "error" ? (
        <p>Something went wrong</p>
      ) : null}
    </div>
  );
}

export default MyWorkBugs;
