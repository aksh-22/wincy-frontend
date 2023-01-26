import { useMutation, useQueryClient } from "react-query";

import { taskAttachment } from "api/milestone";

export const useUpdateTaskAttachment = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(taskAttachment, {

    onSuccess: async (newData, localData, context) => {
      const { milestoneId, orgId, taskId, moduleId } = localData;
      const  previousTasksCopy  =    queryClient.getQueryData(
        ["tasks", orgId, milestoneId]
      );
      try {
        for (let i = 0; previousTasksCopy.length; i++) {
          if (previousTasksCopy[i]?._id[0] === moduleId) {
            let tasks = previousTasksCopy[i]?.tasks;
            for (let j = 0; j < tasks?.length; j++) {
              if (tasks[j]?._id === taskId) {
                tasks[j] = {
                  ...tasks[j],
                  ...newData?.task,
                };
                break;
              }
            }
            break;
          }
        }

        queryClient.setQueryData(
          ["tasks", orgId, milestoneId],
          [...previousTasksCopy]
        );
      } catch (Err) {
        console.error(Err);
      }
    },

    // onError: (err, localData, context) => {
    //   console.error(err);
    //   const { previousTasks , prevMilestones , previousProject } = context;
    //   const { milestoneId, orgId , projectId , assigneesStatus } = localData;
    //   queryClient.setQueryData(["tasks", orgId, milestoneId], previousTasks);
    //   if(assigneesStatus && projectId){
    //     queryClient.setQueryData(["projectInfo", orgId, projectId], {
    //       ...previousProject,
    //     });

    //       queryClient.setQueriesData(
    //         ["milestones", orgId, projectId],
    //         prevMilestones
    //       );
    //     }
      
     
    // },
  });

  return { mutate, isLoading };
};
