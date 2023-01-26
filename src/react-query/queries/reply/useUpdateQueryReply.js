import { updateQueryReply } from 'api/query';
import { useMutation, useQueryClient } from 'react-query';
import { jsonParser } from 'utils/jsonParser';
export const useUpdateQueryReply = (handleClose) => {
  const queryClient = useQueryClient(handleClose);
  const { mutate, isLoading } = useMutation(updateQueryReply, {
      onMutate : (localData) => {
        try{
            const {orgId , projectId , queryId , queryData , replyId} = localData
            

let previousQueries =queryClient.getQueryData(["queries_reply", orgId, projectId , queryId])
let previousQueriesCopy = jsonParser(previousQueries)
let findIndex = previousQueries?.replies?.findIndex((item ) => item?._id === replyId);
previousQueries.replies[findIndex] = {
    ...previousQueries.replies[findIndex],
    ...queryData
};
queryClient.setQueryData(["queries_reply", orgId, projectId , queryId] ,previousQueries )
return {previousQueriesCopy}
        }catch(err) {
            console.error("Error on add query" , err)
        }
    handleClose &&   handleClose();
      },
    onSuccess: async (data , localData) => {
        try{
            const {orgId , projectId , queryId , replyId} = localData
let previousQueries =queryClient.getQueryData(["queries_reply", orgId, projectId , queryId])
let findIndex = previousQueries?.replies?.findIndex((item ) => item?._id === replyId);
previousQueries.replies[findIndex] = data?.reply
queryClient.setQueryData(["queries_reply", orgId, projectId , queryId] ,previousQueries )
        }catch(err) {
            console.error("Error on add query" , err)
        }
    handleClose &&   handleClose();

    //   await queryClient.invalidateQueries('activeProjects');
    },
    onError:(error , localData , context) => {
        try{
            const {orgId , projectId , queryId} = localData
queryClient.setQueryData(["queries_reply", orgId, projectId , queryId] ,context?.previousQueriesCopy )
        }catch(err){
            console.error(error)
        }
    }
  });
  return { mutate, isLoading };
};
