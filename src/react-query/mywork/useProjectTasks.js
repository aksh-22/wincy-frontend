import { useQuery } from "react-query";

import { getProjectMilestones } from "api/project";
import { getMyWorkProjects, getTasks } from "api/myWork";

export const useProjectTasks = (orgId, projId, pageSize, pageNo) => {
  const {
    isLoading: isTasksLoading,
    data: tasksData,
    status: statusProjectTask,
  } = useQuery(
    ["myworkProjectTasks", orgId, projId],
    () => getTasks(orgId, projId, pageSize, pageNo),
    {
      enabled: !!orgId && !!projId,
      retry: 0,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        console.log("onSuccess data:", data);
        // console.log("bef data:", data[1].subTasks);

        data?.map((item) => {
          item.subTasks = item?.subTasks?.reverse() ?? [];
        });

        // console.log("upd data:", data[1].subTasks[0]);
        // console.log("upd data:", data[1].subTasks);
      },
    }
  );
  return { isTasksLoading, tasksData, statusProjectTask };
};
