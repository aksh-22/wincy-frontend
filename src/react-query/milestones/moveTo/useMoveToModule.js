import { useMutation, useQueryClient } from "react-query";
import { moduleMoveTo } from "api/milestone";
import { jsonParser } from "utils/jsonParser";
import { useDispatch } from "react-redux";
export const useMoveToModule = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch()
  const { mutate, isLoading } = useMutation(moduleMoveTo, {
    onMutate: (localData) => {
      try {
        const { data, orgId, milestoneId , handleClose} = localData;
        let previousTasks = queryClient.getQueryData([
          "tasks",
          orgId,
          milestoneId,
        ]);
        let previousModule = queryClient.getQueryData([
            "module",
            orgId,
            milestoneId,
          ]);
        let previousTasksCopy = jsonParser(previousTasks);
        let previousModuleCopy = jsonParser(previousModule)
        let tempTask = previousTasksCopy.filter(
          (item) => !data?.modules.includes(item?._id[0])
        );

        let tempModule = previousModuleCopy?.modules?.filter((item) => !data?.modules.includes(item?._id))

        console.log("tempTask" , tempTask , previousTasksCopy , previousModuleCopy , tempModule)
        queryClient.setQueryData(["tasks", orgId, milestoneId], tempTask);
        queryClient.setQueriesData([
            "module",
            orgId,
            milestoneId,
          ] , {modules : [...tempModule]})
        dispatch({
            type : "MODULE_SELECT",
            payload : []
        })

        handleClose && handleClose()
        return { previousTasks , previousModule };
      } catch (Err) {
        console.error("Error on Move To Module", Err);
      }
    },
    onError: (error, localData, context) => {
      console.error(error);
      const { orgId, milestoneId } = localData;
      const { previousModule , previousTasks } = context
      queryClient.setQueryData(
        ["tasks", orgId, milestoneId],
        previousTasks
      );
      queryClient.setQueryData(
        ["module", orgId, milestoneId],
        previousModule
      );
    },
  });
  return { mutate, isLoading };
};
