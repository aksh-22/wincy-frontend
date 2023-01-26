import React from "react";
import "css/Milestone.css";
import BugTable from "./BugTable";
import { useBugsCount } from "react-query/bugs/useBugsCount";
import BugKanban from "./kanban/BugKanban";
// import BottomActionBar from "components/bottomActionBar/BottomActionBar";

function Bugs({
  projectId,
  platforms,
  projectTitle,
  projectInfo,
  isSelected,
  multiSelection,
  filter,
  team,
  disabled,
  orgId,
  viewType
}) {
  // const [bugPlatform, setBugPlatform] = useState(
  //     Array(platforms?.length + 1).fill('').map((item, i) => (
  //         {
  //             name: platforms[i] ?? 'Un-categorized',
  //             pageNo: 1,
  //             id: platforms[i] ?? null
  //         }
  //     )),
  // )
  const { data, isLoading } = useBugsCount(orgId, projectId);
  return (
    <>
      {viewType === "kanban1" ? <BugKanban 
              projectId={projectId}
              orgId={orgId}
platforms={platforms}
/> : platforms?.map((row, row_index) =>
        filter?.platforms?.length ? (
          <React.Fragment key={row_index}>
            {filter?.platforms?.includes(row?.name) && (
              <BugTable
                // key={row_index}
                data={row}
                projectId={projectId}
                projectInfo={projectInfo}
                isSelected={isSelected}
                multiSelection={multiSelection}
                filter={filter}
                team={team ?? []}
                disabled={disabled}
                count={
                  data?.[
                    row?.name === "Un-categorized" ? "UnCategorised" : row?.name
                  ]
                }
                isBugCountLoading={isLoading}
              />
            )}
          </React.Fragment>
        ) : (
          <React.Fragment key={row_index}>
            <BugTable
              // key={row_index}
              data={row}
              projectId={projectId}
              projectInfo={projectInfo}
              isSelected={isSelected}
              multiSelection={multiSelection}
              filter={filter}
              team={team ?? []}
              disabled={disabled}
              count={
                data?.[
                  row?.name === "Un-categorized" ? "UnCategorised" : row?.name
                ]
              }
              isBugCountLoading={isLoading}
            />
          </React.Fragment>
        )
      )}



      {/* KanbanView */}
{/* <BugKanban 
              projectId={projectId}
              orgId={orgId}
platforms={platforms}
/> */}
    </>
  );
}

export default Bugs;
