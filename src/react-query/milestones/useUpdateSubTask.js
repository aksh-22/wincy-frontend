import { updateSubTask } from "api/milestone";
import { useMutation, useQueryClient } from "react-query";

export const useUpdateSubTask = (fromModule, projectId) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(updateSubTask, {
    onMutate: async (subTask) => {
      // taskId,subtaskId,orgId,milestoneId,data:{ description : '' }

      console.log("localData:", subTask);
      let previousTasks;
      let myworkPreviousTasks;
      let taskIndex;
      let subTaskIndex;

      if (fromModule === "MyWork") {
        myworkPreviousTasks = queryClient.getQueryData([
          "myworkProjectTasks",
          subTask?.orgId,
          projectId,
        ]);
        let myworkPreviousTasksDeepCopy = JSON.parse(
          JSON.stringify(myworkPreviousTasks)
        );
        let bool = false;
        for (let i = 0; i < myworkPreviousTasksDeepCopy?.length; i++) {
          if (myworkPreviousTasksDeepCopy[i]._id === subTask?.taskId) {
            taskIndex = i;
            // console.log("task matched ===");
            for (
              let j = 0;
              j < myworkPreviousTasksDeepCopy[i].subTasks?.length;
              j++
            ) {
              if (
                myworkPreviousTasksDeepCopy[i].subTasks[j]._id ===
                subTask.subtaskId
              ) {
                subTaskIndex = j;
                // console.log(
                //   "bef myworkPreviousTasksDeepCopy[i].subTasks:",
                //   myworkPreviousTasksDeepCopy[i].subTasks[0]
                // );
                // console.log("subtask matched");
                myworkPreviousTasksDeepCopy[i].subTasks[j] = {
                  ...myworkPreviousTasksDeepCopy[i].subTasks[j],
                  ...subTask.data,
                };

                myworkPreviousTasksDeepCopy[
                  i
                ].subTasks = myworkPreviousTasksDeepCopy[i].subTasks.reverse();

                // console.log(
                //   "upd reverse myworkPreviousTasks[i].subTasks:",
                //   myworkPreviousTasksDeepCopy[i].subTasks[0]
                // );
                bool = true;
                break;
              }
            }

            if (bool) {
              break;
            }
          }
        }

        queryClient.setQueryData(
          ["myworkProjectTasks", subTask?.orgId, projectId],
          myworkPreviousTasksDeepCopy
        );
      } else {
        previousTasks = queryClient.getQueryData([
          "tasks",
          subTask.orgId,
          subTask.milestoneId,
        ]);
        // console.log("subTask -> ", previousTasks);
        let newArray = [];
        try {
          previousTasks?.tasks?.map((item) => {
            if (item?._id === subTask?.taskId) {
              item?.subTasks?.map((task, index) => {
                if(subTask?.data?.subtasks){

                
                if (subTask?.data?.subtasks?.includes(task?._id)) {
                  newArray.push({
                    ...task,
                    completed: subTask?.data?.isCompleted,
                  });
                } else {
                  newArray.push(task);
                }
              }else{
                if(subTask?.subtaskId === task?._id){
                  newArray.push({
                    ...task,
                    description: subTask?.data?.description,
                  });
              }else{
                newArray.push(task);
              }
            }
              });
              item.subTasks = newArray?.reverse();
            }
          });
          queryClient.setQueryData(
            ["tasks", subTask.orgId, subTask.milestoneId],
            previousTasks
          );
        } catch (err) {
          console.error("catch error", err);
        }
      }

      return { previousTasks, myworkPreviousTasks, taskIndex, subTaskIndex };
    },

    onError: (err, task, context) => {
      queryClient.invalidateQueries(["tasks", task.orgId, task.milestoneId]);
      context.myworkPreviousTasks[
        context.taskIndex
      ].subTasks = context.myworkPreviousTasks[
        context.taskIndex
      ]?.subTasks?.reverse();

      queryClient.setQueryData(
        ["myworkProjectTasks", task?.orgId, projectId],
        context.myworkPreviousTasks
      );
    },
    onSuccess: (data, localData, context) => {
      console.log("onSuccess data:", data);
    },
  });

  return { mutate, isLoading };
};
