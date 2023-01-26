import { useQuery } from "react-query";

import { getProjectMilestones } from "api/project";
import { getMyworkBugs, getMyWorkProjects, getTasks } from "api/myWork";

export const useMyworkBugs = (orgId, projectId, pageNo) => {
  // console.log(
  //   "orgId, projectId, showTableBody:",
  //   orgId,
  //   projectId,
  //   showTableBody
  // );

  const {
    isLoading: isBugsLoading,
    data: bugsData,
    status: statusBugs,
  } = useQuery(
    ["myworkBugs", orgId, projectId, 1],
    () => getMyworkBugs(orgId, projectId),
    {
      enabled: orgId !== null && projectId !== null,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
  // console.log("444 orgId:", orgId, " projectId:", projectId);

  // console.log("444 bugsData:", bugsData);

  return { isBugsLoading, bugsData, statusBugs };
};
