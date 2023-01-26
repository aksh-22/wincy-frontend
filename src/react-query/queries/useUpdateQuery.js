import { updateQueries } from 'api/query';
import { useMutation, useQueryClient } from 'react-query';
import { jsonParser } from 'utils/jsonParser';
export const useUpdateQuery = (handleClose) => {
  const queryClient = useQueryClient(handleClose);
  const { mutate, isLoading } = useMutation(updateQueries, {
      onMutate : (localData) => {
        try{
            const {orgId , projectId , queryId , queryData , status} = localData
            

let previousQueries = queryClient.getQueryData(["queries", orgId, projectId , status])
let previousQueriesCopy = jsonParser(previousQueries)

let findIndex = previousQueries?.queries?.findIndex((item ) => item?._id === queryId);
console.log("previousQueries.queries[findIndex]"  , previousQueries.queries[findIndex])
previousQueries.queries[findIndex] = {
    ...previousQueries.queries[findIndex],
    ...queryData
};
queryClient.setQueryData(["queries", orgId, projectId , status] ,previousQueries )
return {previousQueriesCopy}

        }catch(err) {
            console.error("Error on add query" , err)
        }
    handleClose &&   handleClose();
      },
    onSuccess: async (data , localData) => {
        try{
            const {orgId , projectId , queryId  , status} = localData

            console.log("Success" , data , status)
let previousQueries = queryClient.getQueryData(["queries", orgId, projectId , status])
let findIndex = previousQueries?.queries?.findIndex((item ) => item?._id === queryId);
previousQueries.queries[findIndex] = data?.query;
queryClient.setQueryData(["queries", orgId, projectId , status] ,previousQueries )
        }catch(err) {
            console.error("Error on add query" , err)
        }
    handleClose &&   handleClose();

    //   await queryClient.invalidateQueries('activeProjects');
    },
    onError:(error , localData , context) => {
      try{
          const {orgId , projectId  , status} = localData
          queryClient.setQueryData(["queries", orgId, projectId , status] ,context?.previousQueriesCopy )

      }catch(err){
          console.error(error)
      }
  }
  });
  return { mutate, isLoading };
};
