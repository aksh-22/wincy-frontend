import { addQuery } from 'api/query';
import { useMutation, useQueryClient } from 'react-query';
export const useAddQuery = (handleClose) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(addQuery, {
    onSuccess: async (data , localData) => {
        try{
            const {orgId , projectId} = localData
let previousQueries = queryClient.getQueryData(["queries", orgId, projectId , "Open"])
previousQueries?.queries?.unshift(data?.query)
queryClient.setQueryData(["queries", orgId, projectId , "Open"] ,previousQueries )
        }catch(err) {
            console.error("Error on add query" , err)
        }
    handleClose &&   handleClose();

    //   await queryClient.invalidateQueries('activeProjects');
    },
  });
  return { mutate, isLoading };
};
