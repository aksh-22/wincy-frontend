import { addTask } from "api/milestone";
import { useMutation, useQueryClient } from "react-query";
import { jsonParser } from "utils/jsonParser";
import { uniqueIdGenerator } from "utils/uniqueIdGenerator";
export const useAddTask = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(addTask, {
    onMutate: async (localData) => {
      try {
        if (localData?.parentId) {
          return await onHandleAddSubTaskLogic({
            localData,
            queryClient,
          });
        } else {
          return await onHandleAddTaskLogic({
            localData,
            queryClient,
          });
        }
      } catch (e) {
        console.error("Error on Task Add", e);
      }
    },

    onSuccess: (newData, localData, context) => {
      try {
        const { orgId, milestoneId, data, projectId, parentId, moduleId } =
          localData;
        const { previousTasksCopy, index, uniqueId, previousSubTaskCopy } =
          context;
        if (parentId) {
          let tempIndex = previousSubTaskCopy?.tasks?.findIndex(
            (item) => item?._id === uniqueId
          );
          if (tempIndex >= 0) {
            previousSubTaskCopy.tasks[tempIndex] = {
              ...newData?.task,
              assignees: data?.assignee,
            };
          }

          queryClient.setQueryData(
            ["subTask", orgId, milestoneId, parentId],
            previousSubTaskCopy
          );
          const previousTasks = queryClient.getQueryData([
            "tasks",
            orgId,
            milestoneId,
          ]);
          let moduleIndex = previousTasks?.findIndex((item) =>
            item?._id?.includes(moduleId)
          );
          if (moduleIndex >= 0) {
            let taskIndex = previousTasks?.[moduleIndex].tasks?.findIndex(
              (item) => item?._id === parentId
            );
            previousTasks?.[moduleIndex].tasks?.[taskIndex]?.childTasks?.push(
              newData?.task?._id
            );
            queryClient.setQueryData(
              ["tasks", orgId, milestoneId],
              previousTasks
            );
          }
          console.log({ previousTasks, newData, localData });
        } else {
          if (index === null) {
            let tempTask = previousTasksCopy[previousTasksCopy?.length - 1];
            tempTask.tasks[0] = {
              ...newData?.task,
              assignees: data?.assignee,
            };
          } else {
            let tempTask = previousTasksCopy[index];
            for (let i = 0; i < tempTask.tasks?.length; i++) {
              if (tempTask.tasks[i]?._id === uniqueId) {
                tempTask.tasks[i] = {
                  ...newData?.task,
                  assignees: data?.assignee,
                };
                break;
              }
            }
          }
          queryClient.setQueryData(
            ["tasks", orgId, milestoneId],
            previousTasksCopy
          );

          // Increase Task Counts
          let previousProject = queryClient.getQueryData([
            "projectInfo",
            orgId,
            projectId,
          ]);
          if (previousProject?.tasksCount?.tasksTotal) {
            previousProject.tasksCount.tasksTotal += 1;
          } else {
            previousProject.tasksCount = { tasksTotal: 1, completedTasks: 0 };
          }
          const prevMilestones = queryClient.getQueryData([
            "milestones",
            orgId,
            projectId,
          ]);

          let prevMilestonesCopy = jsonParser(prevMilestones);
          let milestones = prevMilestonesCopy?.milestones;
          for (let i = 0; i < milestones?.length; i++) {
            if (milestones[i]?._id === milestoneId) {
              const { status } = milestones[i];
              milestones[i] = {
                ...milestones[i],
                taskCount: {
                  ...milestones[i].taskCount,
                  NotStarted: (milestones[i].taskCount?.NotStarted ?? 0) + 1,
                },
                status:
                  status === "Completed"
                    ? "Active"
                    : status === "Active"
                    ? "Active"
                    : "NotStarted",
              };
              break;
            }
          }

          queryClient?.setQueriesData(
            ["projectInfo", orgId, projectId],
            previousProject
          );
          queryClient?.setQueriesData(
            ["milestones", orgId, projectId],
            prevMilestonesCopy
          );
        }
      } catch (err) {
        console.error(err);
      }
    },

    onError: (err, localData, context) => {
      console.error(err);
      const { orgId, milestoneId, parentId } = localData;
      const { previousTasks, previousSubTask } = context;
      if (parentId) {
        queryClient.setQueryData(
          ["subTask", orgId, milestoneId, parentId],
          previousSubTask
        );
      } else {
        queryClient.setQueryData(["tasks", orgId, milestoneId], previousTasks);
      }
    },
  });

  return { mutate, isLoading };
};

const onHandleAddSubTaskLogic = ({ localData, queryClient }) => {
  const { orgId, milestoneId, data, moduleInfo, callBack, parentId } =
    localData;
  let previousSubTask = queryClient?.getQueryData([
    "subTask",
    orgId,
    milestoneId,
    parentId,
  ]);
  const previousSubTaskCopy = jsonParser(previousSubTask);
  let uniqueId = uniqueIdGenerator();
  if (!previousSubTaskCopy?.tasks) {
    previousSubTaskCopy.tasks = [
      {
        _id: uniqueId,
        disabled: true,
        ...data,
        assignees: data?.assignee,
      },
    ];
  } else {
    previousSubTaskCopy?.tasks?.unshift({
      _id: uniqueId,
      disabled: true,
      ...data,
      assignees: data?.assignee,
    });
  }

  callBack && callBack();
  queryClient.setQueryData(
    ["subTask", orgId, milestoneId, parentId],
    previousSubTaskCopy
  );

  return {
    previousSubTaskCopy,
    previousSubTask,
    uniqueId,
  };
};

const onHandleAddTaskLogic = async ({ localData, queryClient }) => {
  const { orgId, milestoneId, data, moduleInfo, callBack } = localData;
  let uniqueId = uniqueIdGenerator();
  await queryClient.cancelQueries(["tasks", orgId, milestoneId]);
  const previousTasks = queryClient.getQueryData(["tasks", orgId, milestoneId]);
  const previousTasksCopy = JSON.parse(JSON.stringify(previousTasks));
  const task = previousTasksCopy?.filter(
    (item) => item?._id?.[0] === moduleInfo?._id
  );

  if (task?.length) {
    task?.[0]?.tasks?.unshift({
      _id: uniqueId,
      disabled: true,
      ...data,
      assignees: data?.assignee,
    });
  } else {
    // "create new task object"
    task.push({
      _id: [moduleInfo?._id],
    });
    task[0].tasks = [
      {
        _id: uniqueId,
        disabled: true,
        ...data,
        assignees: data?.assignee,
      },
    ];
  }
  let index = null;
  previousTasksCopy?.map((item, ind) => {
    if (item?._id === task[0]?._id) {
      index = ind;
    }
    return null;
  });

  if (index === null) {
    previousTasksCopy.push({ ...task[0] });
  } else {
    previousTasksCopy[index] = { ...task[0] };
  }
  callBack();
  queryClient.setQueryData(["tasks", orgId, milestoneId], previousTasksCopy);
  return { previousTasks, previousTasksCopy, index, uniqueId };
};
