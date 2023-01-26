import { useMutation, useQueryClient } from "react-query";
import {  updateLeadActivity } from "api/lead";
import { jsonParser } from "utils/jsonParser";

export const useUpdateLeadActivity = () => {
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation(updateLeadActivity, {
    onMutate: (localData) => {
      try {
          const {orgId , leadId , leadActivityId , data} = localData
          let previousActivity = queryClient.getQueryData(  ["leadActivity", orgId, leadId])
          let previousActivityCopy = jsonParser(previousActivity)
          let activities = previousActivityCopy?.activities
          for(let i=0 ; i <activities?.length ; i++){
            if(activities[i]?._id === leadActivityId){
                activities[i] = {
                    ...activities[i],
                    ...data
                }
                break;
            }
          }
          queryClient.setQueryData(  ["leadActivity", orgId, leadId] , previousActivityCopy)
          return {
            previousActivity
          }
      } catch (error) {
        console.error("Error on update activity", error);
      }
    },
    onError : (_,localData,context) => {
        try {
            const {previousActivity} =context
            const {orgId , leadId } = localData;
          queryClient.setQueryData(  ["leadActivity", orgId, leadId] , previousActivity)

        } catch (error) {
            console.error("Error on update activity Error Block", error);
        }
    }
  });

  return { isLoading, mutate };
};
