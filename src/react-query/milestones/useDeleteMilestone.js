import { deleteMilestone } from 'api/milestone';
import { useMutation, useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';


export const useDeleteMilestone = () => {
    const queryClient = useQueryClient();
    const {goBack} = useHistory()
    
    const { mutate: deleteMilestoneMutate, isLoading } = useMutation(deleteMilestone, {
        onMutate: async (localData) => {
            const previousData = queryClient.getQueryData(["milestones", localData?.orgId, localData?.projectId])
            let newData = JSON.parse(JSON.stringify(previousData))

            try {
                newData.milestones = newData?.milestones?.filter((item) => item?._id !== localData?.milestoneId)

            } catch (e) {
                console.log('dddd', e);
            }
            return {
                newData
            };
        },

        onSuccess: (newData, localData, context) => {

            queryClient.setQueryData(["milestones", localData?.orgId, localData?.projectId], context?.newData)
            localData?.handleClose && localData?.handleClose()
            localData?.toggle && localData?.toggle()
            goBack && goBack()
        },
    });

    return { deleteMilestoneMutate, isLoading };
};
