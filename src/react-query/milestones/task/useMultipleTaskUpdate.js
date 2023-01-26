import { updateMultipleTask } from "api/milestone";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { jsonParser } from "utils/jsonParser";

export const useMultipleTaskUpdate = () => {
  const queryClient = useQueryClient();
 
  const dispatch = useDispatch();
  const { mutate, isLoading } = useMutation(updateMultipleTask, {
    onMutate: (localData) => {
      console.log(localData);
      try {
        const { orgId, milestoneId, assignees, handleClose , isSelected } = localData;
        let previousTasks = queryClient.getQueryData([
          "tasks",
          orgId,
          milestoneId,
        ]);
        let previousTasksCopy = jsonParser(previousTasks);
        for (let i = 0; i < previousTasksCopy?.length; i++) {
          for (let j = 0; j < previousTasksCopy[i]?.tasks?.length; j++) {
            if (isSelected.includes(previousTasksCopy[i]?.tasks[j]?._id)) {
              let tempUpdateStatus = assignees?.map((item) => {
                return {
                  assignee : item?._id,
                  status :"NotStarted"
                }
              })
              previousTasksCopy[i].tasks[j] = {
                ...previousTasksCopy[i].tasks[j],
                assignees: [...assignees],
                assigneesStatus : [...tempUpdateStatus]
              };
            }
          }
        }
        queryClient.setQueryData(
          ["tasks", orgId, milestoneId],
          previousTasksCopy
        );
        dispatch({
          type: "TASK_SELECT",
          payload: [],
        });
        handleClose && handleClose();

        console.log(previousTasks, previousTasksCopy);
        return { previousTasks };
      } catch (err) {
        console.error(err);
      }
    },
    onError: (error, localData, context) => {
      const { orgId, milestoneId } = localData;
      queryClient.setQueryData(
        ["tasks", orgId, milestoneId],
        context?.previousTasks
      );
      console.error(error);
    },
  });
  return { mutate, isLoading };
};
