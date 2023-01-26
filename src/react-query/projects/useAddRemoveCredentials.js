import { addCredentials } from 'api/project';
import { useMutation, useQueryClient } from 'react-query';

export const useAddRemoveCredentials = (orgId, projectId) => {
    const queryClient = useQueryClient();
    const { mutate: mutateCredentials, isLoading: isLoadingCredentials } =
        useMutation(addCredentials, {
            onMutate: (localData) => {
                const previousData = queryClient.getQueryData(["projectInfo", orgId, projectId])
                let newData = JSON.parse(JSON.stringify(previousData))
                const {data} = localData
                let newArray=[]
                try {
                    if(data.hasOwnProperty("removeCredentials")){
                        newData.project.credentials = newData.project.credentials.filter((item) => !data?.removeCredentials?.includes(item?._id))
                    }else if(data.hasOwnProperty("addCredentials")){
                        newData.project.credentials.push(data?.addCredentials[0])
                    }else {
                        console.log(data?.updateCredentials)
                        newData.project.credentials.map((item) => {
                            if(item?._id === data?.updateCredentials[0]?._id){
                                console.log(true)
                                item = {
                                    ...item,
                                    ...data?.updateCredentials[0],
                                    
                                }
                                newArray.push({
                                    ...item,
                                    ...data?.updateCredentials[0],
                                })
                            }else{
                                newArray.push(item)
                            }
                        })
                        newData.project.credentials = [...newArray]
                    }
                } catch (err) {
                    console.log(err)
                }
                !data.hasOwnProperty("removeCredentials") && queryClient.setQueryData(["projectInfo", orgId, projectId] , newData)
                localData?.setShowAddCredentials && localData?.setShowAddCredentials()
                return { newData, previousData }
            },
            onSuccess: (data, localData, context) => {
                console.log("Success", data  ,localData)
                // localData.data.hasOwnProperty("removeCredentials") && queryClient.setQueryData(["projectInfo", orgId, projectId] , context.newData)
                context.newData.project.credentials = [...data?.credentials]
                queryClient.setQueryData(["projectInfo", orgId, projectId] , context.newData)
                localData?.handleClose && localData?.handleClose()
                localData?.onToggle && localData?.onToggle()
            },
            onError: (err, localData, context) => {
                console.log('err:', err, context);
                queryClient.setQueryData(["projectInfo", orgId, projectId] , context?.previousData)
            },
        });

    return { mutateCredentials, isLoadingCredentials };
};
