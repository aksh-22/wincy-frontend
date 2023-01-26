import { useMutation, useQueryClient } from "react-query";

import { bugDelete } from "api/bugs.service";
import { jsonParser } from "utils/jsonParser";

export const useDeleteTaskBug = () => {
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteBug, isLoading: isDeleteBugLoading } =
    useMutation(bugDelete, {
      onMutate: async (localData) => {
        let newBug = [];
        try {
          const { orgId, projectId, taskId, data } = localData;
          let tempBugs = queryClient.getQueryData([
            "taskBugs",
            orgId,
            projectId,
            taskId,
          ]);

          let tempBugs_copy = jsonParser(tempBugs);
          console.log("tempBugs_copy", tempBugs_copy);
          tempBugs_copy = tempBugs_copy?.filter(
            (item) => !data?.bugs?.includes(item?._id)
          );
          return { tempBugs_copy };
        } catch (err) {
          console.log("err:", err);
        }
        return { newBug };
      },

      onSuccess: (data, localData, context) => {
        
        const { orgId, projectId, taskId } = localData;
        queryClient.setQueryData(
          ["taskBugs", orgId, projectId, taskId],
          context?.tempBugs_copy
        );

        localData?.handleClose && localData?.handleClose();
        localData?.onToggle && localData?.onToggle();
      },
    });

  return { mutateDeleteBug, isDeleteBugLoading };
};
