import { useMutation, useQueryClient } from "react-query";
import { updateTask } from "api/milestone";

export const useMyWorkUpdateTask = () => {
  const queryClient = useQueryClient();
  const { mutate: mutateTask, status: taskUpdateStatus } = useMutation(
    updateTask,
    {
      onMutate: async (localData) => {
        console.log("localData:", localData);
        await queryClient.cancelQueries([
          "myworkProjectTasks",
          localData.orgId,
          localData.projectId,
        ]);

        const previousTasks = queryClient.getQueryData([
          "myworkProjectTasks",
          localData.orgId,
          localData.projectId,
        ]);

        let previousTasksDeepCopy = JSON.parse(JSON.stringify(previousTasks));

        // console.log("666 previousTasks:", previousTasks);

        if (localData.type === "checkbox") {
          console.log("in if");
          try {
            previousTasksDeepCopy.map((row, i) => {
              if (row._id === localData.taskId) {
                row.localData = true;
                // let keys = Object.keys(localData.data);
                // console.log("keys:", keys);
                // console.log("localData.data[keys[0]]:", localData.data[keys[0]]);
                // console.log("row[keys[0]]:", row[keys[0]]);
                // console.log("row before:", row);
                // row[keys[0]] = localData.data[keys[0]];
                // console.log("row after:", row);
              }
            });

            queryClient.setQueryData(
              ["myworkProjectTasks", localData.orgId, localData.projectId],
              previousTasksDeepCopy
            );
          } catch (error) {
            console.log("error", error);
          }
        } else {
          // console.log("in else");
          try {
            for (let i = 0; i < previousTasksDeepCopy?.length; i++) {
              if (previousTasksDeepCopy[i]._id === localData.taskId) {
                console.log(
                  "bef previousTasksDeepCopy:",
                  previousTasksDeepCopy[i]
                );

                // row.localData = true;
                previousTasksDeepCopy[i] = {
                  ...previousTasksDeepCopy[i],
                  ...localData?.data,
                };

                previousTasksDeepCopy[i].subTasks = previousTasksDeepCopy[
                  i
                ].subTasks.reverse();

                console.log("previousTasksDeepCopy:", previousTasksDeepCopy[i]);
                break;
              }
            }

            queryClient.setQueryData(
              ["myworkProjectTasks", localData.orgId, localData.projectId],
              previousTasksDeepCopy
            );
          } catch (error) {
            console.log("error", error);
          }
        }
      },
      onSuccess: (data) => {
        console.log("onSuccess data:", data);
      },
      onError: (error) => {
        console.log("error:", error);
      },
    }
  );
  return {
    mutateTask,
    taskUpdateStatus,
  };
};
