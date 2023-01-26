import { createSubTask } from "api/milestone";
import { useMutation, useQueryClient } from "react-query";

export const useAddSubTask = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(createSubTask, {
    onMutate: async (subTask) => {
      console.log("localData:", subTask);
      let myworkPreviousTasks;
      let myworkPreviousTasksDeepCopy;
      let previousTasks = queryClient.getQueryData([
        "tasks",
        subTask.orgId,

        subTask.milestoneId,
      ]);

      // ==============   MyWork module ===============
      if (subTask.fromModule === "MyWork") {
        myworkPreviousTasks = queryClient.getQueryData([
          "myworkProjectTasks",
          subTask?.orgId,
          subTask?.projectId,
        ]);
        myworkPreviousTasksDeepCopy = JSON.parse(
          JSON.stringify(myworkPreviousTasks)
        );

        for (let i = 0; i < myworkPreviousTasksDeepCopy?.length; i++) {
          if (myworkPreviousTasksDeepCopy[i]?._id === subTask?.subtaskId) {
            // console.log(
            //   "bef myworkPreviousTasksDeepCopy:",
            //   myworkPreviousTasksDeepCopy[i].subTasks
            // );
            myworkPreviousTasksDeepCopy[i].subTasks =
              myworkPreviousTasksDeepCopy[i].subTasks.reverse() ?? [];
            myworkPreviousTasksDeepCopy[i].subTasks?.push(subTask?.data);
            // console.log(
            //   "upd myworkPreviousTasksDeepCopy:",
            //   myworkPreviousTasksDeepCopy[i].subTasks
            // );
            break;
          }
        }

        queryClient.setQueryData(
          ["myworkProjectTasks", subTask?.orgId, subTask?.projectId],
          myworkPreviousTasksDeepCopy
        );
      } else {
        console.log("in milestone module");

        //   =================  Milestone Module ==============
        try {
          previousTasks?.tasks.map((item, index) => {
            // console.log("index:", index);
            if (item?._id === subTask?.subtaskId) {
              //   console.log("id matched");
              item.subTasks =
                previousTasks?.tasks[index]?.subTasks.reverse() ?? [];
              item.subTasks.push(subTask?.data);
            }
          });
          //   console.log(" previousTasks?.tasks", previousTasks?.tasks);
          queryClient.setQueryData(
            ["tasks", subTask.orgId, subTask.milestoneId],
            previousTasks
          );
        } catch (err) {
          console.log(err);
        }
      }

      return { previousTasks, myworkPreviousTasks };
    },

    onSuccess: (newData, data, context) => {
      //   console.log("onSuccess data:", newData);
      if (data.fromModule === "MyWork") {
        let myworkPreviousTasksDeepCopy = JSON.parse(
          JSON.stringify(context.myworkPreviousTasks)
        );
        for (let i = 0; i < myworkPreviousTasksDeepCopy?.length; i++) {
          if (myworkPreviousTasksDeepCopy[i]?._id === data?.subtaskId) {
            myworkPreviousTasksDeepCopy[i] = newData?.task;

            break;
          }
        }

        queryClient.setQueryData(
          ["myworkProjectTasks", data?.orgId, data?.projectId],
          myworkPreviousTasksDeepCopy
        );
      } else {
        try {
          let newArray = [];
          context?.previousTasks?.tasks.map((item, index) => {
            if (item?._id === data?.subtaskId) {
              item = {
                ...newData.task,
                subTasks: newData?.task?.subTasks ?? [],
              };
              newArray.push(item);
            } else {
              newArray.push(item);
            }
          });
          context.previousTasks.tasks = [...newArray];
          queryClient.setQueryData(
            ["tasks", data.orgId, data.milestoneId],
            context?.previousTasks
          );
        } catch (err) {
          console.log(err);
        }
      }
    },

    onError: (err, data, context) => {
      console.log("err:", err);
      let newArray = [];
      context?.previousTasks?.tasks.map((item, index) => {
        let newSubtask = [];
        if (item?._id === data?.subtaskId) {
          console.log("data?.subtaskId", data?.subtaskId);
          item?.subTasks?.map((subTask) => {
            if (subTask?._id === undefined) {
              console.log("id not fount", subTask);
            } else {
              console.log("id  fount", subTask);
              newSubtask.push(subTask);
            }
          });
          newArray.push({
            ...item,
            subTasks: [...newSubtask],
          });
        } else {
          newArray.push(item);
        }
      });
      //   console.log("newArray", newArray);s
      context.previousTasks.tasks = [...newArray];
      queryClient.setQueryData(
        ["tasks", data.orgId, data.milestoneId],
        context?.previousTasks
      );
    },
  });

  return { mutate, isLoading };
};
