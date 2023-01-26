import { useMutation, useQueryClient } from "react-query";
import {  deleteLeadActivity } from "api/lead";
import { jsonParser } from "utils/jsonParser";

export const useDeleteLeadActivity = () => {
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation(deleteLeadActivity, {
    onMutate: (localData) => {
try {
    const {orgId , leadId , leadActivityId , handleClose} = localData
    let previousActivity = queryClient.getQueryData(  ["leadActivity", orgId, leadId])
    let previousActivityCopy = jsonParser(previousActivity)
    let activities = previousActivityCopy?.activities;
    let removeItemIndex = activities?.findIndex((item) => item?._id === leadActivityId)
    activities.splice(removeItemIndex , 1)
    queryClient.setQueryData(  ["leadActivity", orgId, leadId] , previousActivityCopy)
    handleClose && handleClose();
    return {
        previousActivity
    }
} catch (error) {
    console.error("Error on delete activity" , error)
}
    },
    onError : (_,localData,context) => {
        try {
            const {previousActivity} =context
            const {orgId , leadId } = localData;
          queryClient.setQueryData(  ["leadActivity", orgId, leadId] , previousActivity)

        } catch (error) {
            console.error("Error on delete activity Error Block", error);
        }
    }
})
    return {isLoading , mutate}
}