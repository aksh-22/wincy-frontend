// TODO: Delete File

// import { markMultipleSubTask, subTasksDelete } from "api/milestone";
import { useMutation, useQueryClient } from "react-query";
export const useMarkMultipleSubtask = (fromModule, projectId) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation('markMultipleSubTask', {
    onMutate: async (subTask) => {
      // data: {
      //     subTasks: isSelected,
      //     isCompleted: isCompleted,
      //   },
      //   orgId,
      //   taskId: taskInfo?._id,
      //   milestoneId: taskInfo?.milestone,
      console.log("localData:", subTask);
      let previousTasks;
      if (fromModule === "MyWork") {
        let myworkPreviousTasks = queryClient.getQueryData([
          "myworkProjectTasks",
          subTask.orgId,
          projectId,
        ]);
        let newSubtask = [];
        let bool = false;
        for (let i = 0; i < myworkPreviousTasks?.length; i++) {
          if (myworkPreviousTasks[i]?._id === subTask?.taskId) {
            console.log("taskId Matched");
            for (
              let j = 0;
              j < myworkPreviousTasks?.[i]?.subTasks?.length;
              j++
            ) {
              if (
                subTask?.data?.subTasks?.includes(
                  myworkPreviousTasks?.[i]?.subTasks[j]._id
                )
              ) {
                // subTask?.data.isCompleted;
                myworkPreviousTasks[i].subTasks[j] = {
                  ...myworkPreviousTasks?.[i]?.subTasks[j],
                  completed: subTask?.data?.isCompleted,
                };
              }
            }

            myworkPreviousTasks[i].subTasks = myworkPreviousTasks[
              i
            ].subTasks.reverse();
            break;
          }
        }

        queryClient.setQueryData(
          ["myworkProjectTasks", subTask.orgId, projectId],
          myworkPreviousTasks
        );
        subTask?.onToggle && subTask?.onToggle();

        // MyWork ends here
      } else {
        previousTasks = queryClient.getQueryData([
          "tasks",
          subTask.orgId,
          subTask.milestoneId,
        ]);

        //   console.log("subTask -> ", previousTasks, subTask);
        let newTask = JSON.parse(JSON.stringify(previousTasks));
        let newArray = [];
        try {
          newTask?.tasks?.map((item) => {
            if (item?._id === subTask?.taskId) {
              item?.subTasks?.map((task, index) => {
                if (subTask?.data?.subTasks?.includes(task?._id)) {
                  newArray.push({
                    ...task,
                    completed: subTask?.data?.isCompleted,
                    // ...subTask?.data
                  });
                } else {
                  newArray.push(task);
                }
              });
              item.subTasks = newArray?.reverse();
            }
          });
          // console.log(":ASdasd", newArray);
          queryClient.setQueryData(
            ["tasks", subTask.orgId, subTask.milestoneId],
            newTask
          );
          subTask?.onToggle && subTask?.onToggle();
        } catch (err) {
          console.error("catch error", err);
        }
      }

      return { previousTasks };
    },
    onSuccess: (data, localData) => {
      console.log("onSuccess data:", data);
      //   if (fromModule === "MyWork") {
      //     let myworkPreviousTasks = queryClient.getQueryData([
      //       "myworkProjectTasks",
      //       localData.orgId,
      //       projectId,
      //     ]);

      //     for (let i = 0; i < myworkPreviousTasks?.length; i++) {
      //       if (myworkPreviousTasks[i]._id === localData?.taskId) {
      //         myworkPreviousTasks[i] = data.task;
      //       }
      //     }

      //     myworkPreviousTasks = queryClient.setQueryData(
      //       ["myworkProjectTasks", localData.orgId, projectId],
      //       myworkPreviousTasks
      //     );
      //   }
    },

    onError: (err, task, context) => {
      console.log("context", context);
      queryClient.setQueryData(
        ["tasks", task.orgId, task.milestoneId, ,],
        context.previousTasks
      );
    },
  });
  return { mutate, isLoading };
};
