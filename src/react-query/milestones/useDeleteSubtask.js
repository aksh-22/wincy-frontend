
// TODO: Delete File

// import { subTasksDelete } from "api/milestone";
import { useMutation, useQueryClient } from "react-query";

export const useDeleteSubtask = (fromModule, projectId) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation('subTasksDelete', {
    onMutate: async (task) => {
      let myworkProjectTasks;
      let myworkProjectTasksDeepCopy;

      const previousTasks = queryClient.getQueryData([
        "tasks",
        task.orgId,
        task.milestoneId,
      ]);

      // myworkProjectTasks = queryClient.getQueryData([
      //   "myworkProjectTasks",
      //   task.orgId,
      //   projectId,
      // ]);

      try {
        // myworkProjectTasksDeepCopy = JSON.parse(
        //   JSON.stringify(myworkProjectTasks)
        // );
      } catch (err) {
        console.log("err", err);
      }
      return {};
    },

    onSuccess: (newData, data) => {
      console.log("onSuccess newData:", newData.task);
      console.log("data:", data);
      console.log("fromModole:", fromModule);
      let task = newData?.task;

      if (fromModule === "MyWork") {
        let myworkPreviousTasks;
        myworkPreviousTasks = queryClient.getQueryData([
          "myworkProjectTasks",
          data.orgId,
          projectId,
        ]);

        for (let i = 0; i < myworkPreviousTasks.length; i++) {
          if (data.taskId === myworkPreviousTasks[i]._id) {
            console.log("task matched");
            myworkPreviousTasks[i] = newData.task;
            console.log(myworkPreviousTasks[i].subTasks);
            break;
          }
        }

        myworkPreviousTasks = queryClient.setQueryData(
          ["myworkProjectTasks", data.orgId, projectId],
          myworkPreviousTasks
        );

        data?.handleClose && data?.handleClose();
        data?.onToggle && data?.onToggle();
      } else {
        const currentTasks = queryClient.getQueryData([
          "tasks",
          data.orgId,
          data.milestoneId,
        ]);

        task?.subTasks.reverse();

        let tempTask = currentTasks?.tasks?.map((x, i) => {
          if (x?._id === data?.taskId) {
            x = {
              ...task,
              subTasks: task?.subTasks?.reverse() ?? [],
            };
          }
          return x;
        });
        // console.log("-->", tempTask);
        queryClient.setQueryData(["tasks", data.orgId, data.milestoneId], {
          tasks: [...tempTask],
        });

        data?.handleClose && data?.handleClose();
        data?.onToggle && data?.onToggle();
        // setTaskWillAdd(false);
      }
    },

    onError: (err, milestone, context) => {
      //   queryClient.setQueryData('milestones', context.previousTasks);
    },
  });

  return { mutate, isLoading };
};
