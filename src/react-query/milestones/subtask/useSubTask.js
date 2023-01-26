import { useQuery } from "react-query";
import { getSubTasks } from "api/milestone";

export const useSubTask = ({ orgId, taskId, milestoneId }) => {
  return useQuery(
    ["subTask", orgId, milestoneId, taskId],
    () =>
      getSubTasks({
        milestoneId,
        orgId,
        taskId,
      }),
    {
      enabled: !!orgId && !!milestoneId && !!taskId,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
};
