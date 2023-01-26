import { addProjectAttachment } from 'api/project';
import { useMutation, useQueryClient } from 'react-query';

export const useAddProjectAttachment = (orgId, projectId) => {
    const queryClient = useQueryClient();
    const { mutate: mutateAddAttachment, isLoading: isLoadingAddAttachment } =
        useMutation(addProjectAttachment, {
            onMutate: (localData) => {
                const previousData = queryClient.getQueryData(['projectAttachment', orgId, projectId])
                let newData = JSON.parse(JSON.stringify(previousData))
                try {

                    if (localData?.newFolder) {
                        newData?.attachments?.unshift({
                            _id: { folder: localData?.data?.folder },
                            attachments : []
                        })
                    } else {

                    }
                    queryClient.setQueryData(['projectAttachment', orgId, projectId], newData)
                    console.log({ newData, previousData })
                } catch (err) {
                    console.error(err)
                }
                return { newData, previousData }
            },
            onSuccess: (data, localData, context) => {
                console.log("Success", data)
                if (localData?.newFolder) {
                    context?.newData?.attachments?.map((item, index) => {
                        if (item?._id?.folder === localData?.data?.folder) {
                            data?.attachments?.map((row, i) => {
                                item?.attachments.push(row)
                            })
                        }
                    })
                } else {
                    context?.newData?.attachments?.map((item, index) => {
                        if (item?._id?.folder === localData?.folder) {
                            data?.attachments?.map((row, i) => {
                                if(!item?.attachments){
                                    item.attachments = []
                                    
                                }
                                item?.attachments.push(row)
                            })

                        }
                    })
                    console.log('====================================');
                    console.log({ context });
                    console.log('====================================');
                }
                queryClient?.setQueryData(['projectAttachment', orgId, projectId], context?.newData)
              
                localData?.handleClose && localData?.handleClose()
                localData?.clearLocalAttachment && localData?.clearLocalAttachment()
            },
            onError: (err, localData, context) => {
                queryClient.setQueryData(['projectAttachment', orgId, projectId], context?.previousData)
                console.error('err:', err, context);
            },
        });

    return { mutateAddAttachment, isLoadingAddAttachment };
};
