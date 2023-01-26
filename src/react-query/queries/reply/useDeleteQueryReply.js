import { deleteQueryReply } from "api/query";
import { useMutation, useQueryClient } from "react-query";
export const useDeleteQueryReply = (handleClose) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(deleteQueryReply, {
    onSuccess: async (data, localData) => {
      try {
        const { orgId, projectId , index , queryId } = localData;
        let previousQueries = queryClient.getQueryData([
            "queries_reply", orgId, projectId , queryId
        ]);
        previousQueries?.replies?.splice(index , 1);
        queryClient.setQueryData(
          ["queries_reply", orgId, projectId , queryId],
          previousQueries
        );

        let previousQueries_ = queryClient.getQueryData(["queries", orgId, projectId])
let index_ = previousQueries_?.queries?.findIndex((item) => item?._id === queryId)
previousQueries_.queries[index_].count = (previousQueries_.queries[index_].count??1)-1;
queryClient.setQueryData(["queries", orgId, projectId] , previousQueries_)
      } catch (err) {
        console.error("Error on add query", err);
      }
      handleClose && handleClose();

      //   await queryClient.invalidateQueries('activeProjects');
    },
  });
  return { mutate, isLoading };
};
