import {  getTaskRelevantBugs } from "api/bugs.service";
import { useQuery } from "react-query";

export const useTaskBugs = ({ orgId, projectId, taskId }) => {
  return useQuery(
    ["taskBugs", orgId, projectId, taskId],
    () => getTaskRelevantBugs({orgId, projectId, taskId}),
    {
      enabled: !!orgId && !!projectId && !!taskId,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
};
