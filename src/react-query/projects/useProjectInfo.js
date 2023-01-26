import { useQuery, useQueryClient } from "react-query";

import { getProjectInfo } from "api/project";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export const useProjectInfo = (projectId) => {
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const queryClient = useQueryClient();

  const { isLoading, data  ,isError , error} = useQuery(
    ["projectInfo", orgId, projectId],
    () => getProjectInfo(orgId, projectId),
    {
      enabled: !!orgId && !!projectId,
      retry: 0,
    }
  );

  let count = []
  if(data){
if(data?.tasksCount){
  count?.push(`Tasks ${data?.tasksCount?.completedTasks ?? 0}/${
    data?.tasksCount?.tasksTotal ?? 0
  }`)
}

if (data?.todosCount) {
  count.push(
    `Todos ${data?.todosCount?.completedTodos ?? 0}/${
      data?.todosCount?.totalTodos ?? 0
    }`
  );
}

if (data?.project?.milestoneCount) {
  let milestoneCount = data?.project?.milestoneCount;
  let denominator =
    (milestoneCount?.Active ?? 0) +
    (milestoneCount?.NotStarted ?? 0) +
    (milestoneCount?.Completed ?? 0);

  count.push(
    `Milestones ${milestoneCount?.Completed ?? 0}/${denominator ?? 0}`
  );
}
data.count= count
  }

  return {
    isLoading,
    data,
    isError,
    error
  };
};
