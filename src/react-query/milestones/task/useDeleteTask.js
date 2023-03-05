import { deleteTask } from "api/project";
import { useMutation, useQueryClient } from "react-query";
import { jsonParser } from "utils/jsonParser";

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteTaskMutate, isLoading } = useMutation(deleteTask, {
    onMutate: async (localData) => {
      try {
        const { type } = localData;
        if (type === "subTask") {
          onSubTaskDeleteLogic({
            localData,
            queryClient,
          });
        } else {
          onTaskDeleteLogic({
            localData,
            queryClient,
          });
        }
      } catch (err) {
        console.error(err);
      }
    },

    onSuccess: async (data, localData) => {
      try {
        const { milestoneId, orgId, onToggle, handleClose } = localData;
        await queryClient.invalidateQueries(["tasks", orgId, milestoneId]);
        handleClose && handleClose();
        onToggle && onToggle();
      } catch (error) {}
    },

    onError: (error, localData, context) => {
      const { milestoneId, projectId, orgId, type } = localData;
      const { previousTasks, previousProject, subTasksData } = context;
      if (type === "subTask") {
        for (const _id in subTasksData) {
          queryClient.setQueryData(
            ["subTask", orgId, milestoneId, _id],
            subTasksData[_id]
          );
        }
      } else {
        queryClient.setQueryData(["tasks", orgId, milestoneId], previousTasks);
        queryClient.setQueryData(
          ["projectInfo", orgId, projectId],
          previousProject
        );
      }

      console.error(error);
    },
  });

  return { deleteTaskMutate, isLoading };
};

const onSubTaskDeleteLogic = async ({ localData, queryClient }) => {
  const { milestoneId, orgId, onToggle, handleClose, subTask } = localData;
  let temp = {};
  for (const property in subTask) {
    temp[property] = await queryClient.getQueryData([
      "subTask",
      orgId,
      milestoneId,
      property,
    ]);
  }
  let subTasksCopy = jsonParser(temp);
  for (const _id in subTasksCopy) {
    subTasksCopy[_id].tasks = subTasksCopy[_id]?.tasks?.filter(
      (item) => !subTask?.[_id]?.includes(item?._id)
    );

    queryClient.setQueryData(
      ["subTask", orgId, milestoneId, _id],
      subTasksCopy[_id]
    );
  }

  // handleClose && handleClose();
  // onToggle && onToggle();
  return {
    subTasksData: temp,
  };
};

const onTaskDeleteLogic = ({ localData, queryClient }) => {
  const { milestoneId, data, projectId, orgId, onToggle, handleClose } =
    localData;
  let previousTasks = queryClient.getQueryData(["tasks", orgId, milestoneId]);
  let previousTasksCopy = jsonParser(previousTasks);
  let tempTask = [];
  let deleteTasks = [];
  previousTasksCopy?.map((item, index) => {
    tempTask.push({
      _id: [item?._id[0]],
      tasks: [],
    });
    item?.tasks?.map((row) => {
      if (!data?.tasks?.includes(row?._id)) {
        tempTask[index]?.tasks?.push(row);
      } else {
        deleteTasks.push(row);
      }
      return null;
    });
    return null;
  });
  queryClient.setQueryData(["tasks", orgId, milestoneId], [...tempTask]);

  // Change in Count --->
  let previousProject = queryClient.getQueryData([
    "projectInfo",
    orgId,
    projectId,
  ]);
  let previousProjectCopy = jsonParser(previousProject);
  let tasksCount = previousProjectCopy?.tasksCount;
  let completedTasksDeleteCount = 0;
  let statusCount = {
    Active: 0,
    Completed: 0,
    NotStarted: 0,
  };
  deleteTasks?.map((item) => {
    if (item?.status === "Completed") {
      completedTasksDeleteCount += 1;
      statusCount = {
        ...statusCount,
        Completed: statusCount.Completed + 1,
      };
    } else if (item?.status === "Active") {
      statusCount = {
        ...statusCount,
        Active: statusCount.Active + 1,
      };
    } else {
      statusCount = {
        ...statusCount,
        NotStarted: statusCount.NotStarted + 1,
      };
    }
    return null;
  });
  tasksCount = {
    completedTasks: tasksCount?.completedTasks - completedTasksDeleteCount,
    tasksTotal: tasksCount?.tasksTotal - deleteTasks?.length,
  };
  previousProjectCopy.tasksCount = tasksCount;

  // Milestone Update
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
      const { NotStarted, Active, Completed } = milestones[i].taskCount;
      let tempMilestoneCount = {
        NotStarted: 0,
        Active: 0,
        Completed: 0,
      };
      if (NotStarted > 0) {
        tempMilestoneCount = {
          ...tempMilestoneCount,
          NotStarted: NotStarted - statusCount?.NotStarted,
        };
      }
      if (Active > 0) {
        tempMilestoneCount = {
          ...tempMilestoneCount,
          Active: Active - statusCount?.Active,
        };
      }
      if (Completed > 0) {
        tempMilestoneCount = {
          ...tempMilestoneCount,
          Completed: Completed - statusCount?.Completed,
        };
      }
      let tempStatus = status;
      if (
        tempMilestoneCount?.NotStarted > 0 &&
        (tempMilestoneCount?.Active === 0 || !tempMilestoneCount?.Active) &&
        (tempMilestoneCount?.Completed === 0 || !tempMilestoneCount?.Completed)
      ) {
        tempStatus = "NotStarted";
      }

      if (
        tempMilestoneCount?.Active > 0
        // &&
        // (tempMilestoneCount?.Active === 0 ||
        //   !tempMilestoneCount?.Active) &&
        // (tempMilestoneCount?.Completed === 0 ||
        //   !tempMilestoneCount?.Completed)
      ) {
        tempStatus = "Active";
      }

      if (
        tempMilestoneCount?.Completed > 0 &&
        (tempMilestoneCount?.NotStarted === 0 ||
          !tempMilestoneCount?.NotStarted) &&
        (tempMilestoneCount?.Active === 0 || !tempMilestoneCount?.Active)
      ) {
        tempStatus = "Completed";
      }

      // let tempMilestonCount = {}
      // if()
      milestones[i] = {
        ...milestones[i],
        taskCount: tempMilestoneCount,
        status: tempStatus,
      };
      console.log("milestones[i]", milestones[i], statusCount);
      break;
    }
  }
  queryClient.setQueryData(
    ["projectInfo", orgId, projectId],
    previousProjectCopy
  );
  queryClient?.setQueriesData(
    ["milestones", orgId, projectId],
    prevMilestonesCopy
  );
  // handleClose && handleClose();
  // onToggle && onToggle();

  return { previousTasks, previousProject };
};
