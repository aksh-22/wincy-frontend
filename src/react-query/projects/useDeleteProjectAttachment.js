import { deleteProjectAttachment } from 'api/project';
import { useMutation, useQueryClient } from 'react-query';

export const useDeleteProjectAttachment = (orgId, projectId) => {
    const queryClient = useQueryClient();
    const { mutate: mutateDeleteAttachment, isLoading: isLoadingDelete } =
        useMutation(deleteProjectAttachment, {
            onMutate: (localData) => {
                // console.log("localData", localData)
                const previousData = queryClient.getQueryData(['projectAttachment', orgId, projectId])
                let newData = JSON.parse(JSON.stringify(previousData))
            
                // console.log({ newData })
                try {
                    if(localData?.isFolderDelete){
                        let attachments = newData?.attachments
                       //  let newData1=[]
                       let index = 0
                       for(let i=0 ; i<attachments.length ; i++){
                           if(attachments[i]._id.folder === localData?.folderName){
                               index = i
                               break;
                           }
                       }
                       attachments.splice(index , 1)
                       // console.log({attachments})
                    }else{
                       newData?.attachments?.map((item) => {
                           item.attachments = item?.attachments.filter((row) => !localData?.data?.[Object.keys(localData?.data)[0]]?.includes(row?._id))
                           return null
                       })
                    }
                } catch (err) {
                    console.error(err)
                }
                return { previousData, newData }
            },
            onSuccess: (data, localData, context) => {
                // console.log("Success", data)
                queryClient.setQueryData(['projectAttachment', orgId, projectId], context?.newData)
                localData?.handleClose && localData?.handleClose()
                localData?.onToggle && localData?.onToggle()
            },
            onError: (err, localData, context) => {
                queryClient.setQueryData(['projectAttachment', orgId, projectId], context?.previousData)
                // console.log('err:', err);
            },
        });

    return { mutateDeleteAttachment, isLoadingDelete };
};
