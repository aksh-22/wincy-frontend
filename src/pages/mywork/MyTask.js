import CustomPopper from "components/CustomPopper";
import { LightTooltip } from "components/tooltip/LightTooltip";
import React, { useState } from "react";
import { useMyWorkProjects } from "react-query/mywork/useMyWorkProjects";
import { useSelector } from "react-redux";
import TableRowSkeleton from "skeleton/tableRow/TableRowSkeleton";
import MyTaskTable from "./MyTaskTable";
import "./scss/MyTask.scss";
import FilterListIcon from "@material-ui/icons/FilterList";
import FilterInProject from "pages/projects/FilterInProject";
import NoData from "components/NoData";
import ProfilePopupCss from "css/ProfilePopup.module.css";

function MyTask() {
  const orgId = useSelector(
    (state) => state?.userReducer?.selectedOrganisation?._id
  );

  const { myworkProjectsData, isMyWorkProjectsLoading, statusProject } =
    useMyWorkProjects(orgId);

  const [filter, setFilter] = useState({
    projectIds: [],
    priority: [],
    status: [],
  });

  const clearFilter = () => {
    setFilter({
      projectIds: [],
      priority: [],
      status: [],
    })
  }
  const filterCount = () => {
    const {
      projectIds,
      priority,
      status,
    } = filter;
    let filterCount =
      (projectIds.length ? 1 : 0) +
      (status?.length ? 1 : 0) +
      (priority?.length ? 1 : 0) 

    return filterCount;
  };

  // console.log("MyTask filter:", filter);

  // console.log("statusProjectTask:", statusProject);
  // console.log("orgId:", orgId);

  return (
    <div className="mytask">
      {statusProject === "loading" ? (
        <p>
          <TableRowSkeleton count={2} height={30} />
        </p>
      ) : statusProject === "error" ? (
        <p>Something went wrong</p>
      ) : statusProject === "success" ? (
        myworkProjectsData?.length === 0 ? (
          <NoData />
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
                    type="task"
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
                    status={["Not Started", "Completed", "Active"]}
                    noPlatform
                    noAssignee
                    
                    clearFilter={clearFilter}
                    filterCount={filterCount()}
                  />
                }
              />
            </div>
            {myworkProjectsData?.map((row, i) => {
              return <MyTaskTable item={row} orgId={orgId} filter={filter} />;
            })}
          </>
        )
      ) : (
        <p>Something went wrong</p>
      )}
    </div>
  );
}

export default MyTask;
