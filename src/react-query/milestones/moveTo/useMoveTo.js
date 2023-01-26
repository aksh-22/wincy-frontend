import { moveTo } from "api/milestone";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { jsonParser } from "utils/jsonParser";

export const useMoveTo = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch()
  const { mutate, isLoading } = useMutation(moveTo, {
    onMutate: (localData) => {
      // console.log("--->", localData);
      const {
        data,
        orgId,
        moduleId,
        milestoneId,
        // projectId,
        otherMilestoneMove,
        previousMilestoneId,
        handleClose
      } = localData;
      const { tasks } = data;
      try {
        // let previousModule = queryClient.getQueryData([
        //   "module",
        //   orgId,
        //   milestoneId,
        // ]);
        // let perviousMilestone = queryClient.getQueryData([
        //   "milestones",
        //   orgId,
        //   projectId,
        // ]);
        let previousTasks = queryClient.getQueryData([
          "tasks",
          orgId,
          !otherMilestoneMove ? milestoneId : previousMilestoneId,
        ]);
        let previousOtherMilestone = {};
        if (previousMilestoneId) {
          previousOtherMilestone = queryClient.getQueryData([
            "tasks",
            orgId,
            milestoneId,
          ]);
        }
        // let previousModuleCopy = jsonParser(perviousMilestone);
        // let previousMilestoneCopy = jsonParser(perviousMilestone);
        let previousTasksCopy = jsonParser(previousTasks ?? []);
        let previousOtherMilestoneCopy = jsonParser(
          previousOtherMilestone ?? []
        );
        let moveToTasks = [];
        let newTasks = [];

        previousTasksCopy?.map((item, index) => {
          newTasks.push({
            _id: item?._id,
            tasks: [],
          });
          item?.tasks?.map((row) => {
            if (tasks?.includes(row?._id)) {
              moveToTasks.push(row);
            } else {
              newTasks[index]?.tasks?.push(row);
            }
            return null;
          });
          return item;
        });

        if (otherMilestoneMove) {
          for (let i = 0; i < previousOtherMilestoneCopy?.length; i++) {
            if (previousOtherMilestoneCopy[i]?._id[0] === moduleId) {
              previousOtherMilestoneCopy[i].tasks = [
                ...moveToTasks,
                ...previousOtherMilestoneCopy[i]?.tasks,
              ];
            }
          }
        } else {
          const taskObject = newTasks?.filter(
            (item) => item?._id?.[0] === moduleId
          );
          if (taskObject?.length) {
            taskObject[0].tasks = [...taskObject[0]?.tasks, ...moveToTasks];
          } else {
            // "create new task object"
            taskObject.push({
              _id: [moduleId],
            });
            taskObject[0].tasks = moveToTasks;
          }

          let index = null;
          newTasks?.map((item, ind) => {
            if (item?._id === taskObject[0]?._id) {
              index = ind;
            }
            return null;
          });
          if (index === null) {
            newTasks.push({ ...taskObject[0] });
          } else {
            newTasks[index] = { ...taskObject[0] };
          }
        }

        queryClient.setQueryData(
          [
            "tasks",
            orgId,
            !otherMilestoneMove ? milestoneId : previousMilestoneId,
          ],
          newTasks
        );
        if (otherMilestoneMove) {
          queryClient.setQueryData(
            ["tasks", orgId, milestoneId],
            previousOtherMilestoneCopy
          );
        }
        dispatch({
          type : "TASK_SELECT",
          payload : []
        })
        handleClose && handleClose()
      } catch (err) {
        console.error("error on move to", err);
      }
    },
    onError: (error) => {
      console.error("Error on Move To", error);
      // TODO: Revert on Error Pending
    },
  });

  return { mutate, isLoading };
};
