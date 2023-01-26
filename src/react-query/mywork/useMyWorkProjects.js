import { useQuery } from "react-query";

import { getProjectMilestones } from "api/project";
import { getMyWorkProjects } from "api/myWork";

export const useMyWorkProjects = (orgId) => {
  const {
    isLoading: isMyWorkProjectsLoading,
    data: myworkProjectsData,
    status: statusProject,
  } = useQuery(["myworkProjects", orgId], () => getMyWorkProjects(orgId), {
    enabled: !!orgId,
    retry: 0,
    refetchOnWindowFocus: false,
  });
  return { isMyWorkProjectsLoading, myworkProjectsData, statusProject };
};
