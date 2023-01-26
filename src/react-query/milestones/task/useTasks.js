import { getMilestoneTask } from "api/milestone";
import { useQuery } from "react-query";

export const useTasks = (orgId, milestoneId) => {
  const { isLoading, data } = useQuery(
    ["tasks", orgId, milestoneId],
    () => getMilestoneTask(orgId, milestoneId),
    {
      enabled:
        !!orgId && !!milestoneId,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  return { isLoading, data };
};
