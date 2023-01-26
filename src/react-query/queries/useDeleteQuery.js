import { deleteQueries } from "api/query";
import { useMutation, useQueryClient } from "react-query";
export const useDeleteQuery = (handleClose) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(deleteQueries, {
    onSuccess: async (data, localData) => {
      try {
        const { orgId, projectId , index , status } = localData;
        let previousQueries = queryClient.getQueryData([
          "queries",
          orgId,
          projectId,
          status
        ]);
        previousQueries?.queries?.splice(index , 1);
        queryClient.setQueryData(
          ["queries", orgId, projectId , status],
          previousQueries
        );
      } catch (err) {
        console.error("Error on add query", err);
      }
      handleClose && handleClose();

      //   await queryClient.invalidateQueries('activeProjects');
    },
  });
  return { mutate, isLoading };
};
