import { addQueryReply } from 'api/query';
import { useMutation, useQueryClient } from 'react-query';
export const useAddReply = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(addQueryReply, {
    onSuccess: async (data , localData) => {
        try{
            const {orgId , projectId , callback , queryId , queryStatus} = localData
let previousQueries = queryClient.getQueryData(["queries_reply", orgId, projectId , queryId])
previousQueries?.replies?.push(data?.reply)
queryClient.setQueryData(["queries_reply", orgId, projectId , queryId] ,previousQueries )


let previousQueries_ = queryClient.getQueryData(["queries", orgId, projectId , queryStatus])
let index = previousQueries_?.queries?.findIndex((item) => item?._id === queryId)
previousQueries_.queries[index].count = (previousQueries_.queries[index].count??0)+1;
queryClient.setQueryData(["queries", orgId, projectId , queryStatus] , previousQueries_)
callback && callback()
        }catch(err) {
            console.error("Error on add query" , err)
        }
    },
    // onSettled:(localData) => {
    //   const {orgId , projectId } = localData
    //     queryClient.invalidateQueries(["queries", orgId, projectId]);
    // }
  });
  return { mutate, isLoading };
};
