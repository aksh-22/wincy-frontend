import { useMutation, useQueryClient } from "react-query";
import { updateLead } from "api/lead";
import { jsonParser } from "utils/jsonParser";

export const useUpdateLead = (tabStatus) => {
  const queryClient = useQueryClient();

  // mutate Function

  const { isLoading, mutate } = useMutation(updateLead, {
    onMutate: (localData) => {
      try {
        const { orgId, leadId, data, leadStatus, managedByData } = localData;
        //         let isStatusChange = false
        //         if(data?.status){
        // if(leadStatus !== data?.status){
        //   isStatusChange = true
        // }
        //         }
        //         console.log("isStatusChange" , isStatusChange , leadStatus)
        const previousSingleLead = queryClient.getQueryData([
          "lead",
          orgId,
          leadId,
        ]);
        const previousStatusLeads = queryClient.getQueryData([
          "leads",
          orgId,
          tabStatus,
        ]);

        let previousSingleLeadCopy = previousSingleLead
          ? jsonParser(previousSingleLead)
          : {};
        let previousStatusLeadsCopy = jsonParser(previousStatusLeads);
        let leads = previousStatusLeadsCopy?.data?.leads;
        if (managedByData) {
          previousSingleLeadCopy.lead = {
            ...previousSingleLeadCopy?.lead,
            managedBy: managedByData,
          };
        } else {
          previousSingleLeadCopy.lead = {
            ...previousSingleLeadCopy?.lead,
            ...data,
          };
        }

        queryClient.setQueryData(["lead", orgId, leadId], {
          ...previousSingleLeadCopy,
        });
        for (let i = 0; i < leads?.length; i++) {
          if (leads[i]?._id === leadId) {

            if (managedByData) {
              leads[i] = {
                ...leads[i],
                managedBy: [managedByData],
              };
            } else {
              leads[i] = {
                ...leads[i],
                ...data,
              };
            }
            break;
          }
        }

        queryClient.setQueryData(["leads", orgId, tabStatus], {
          ...previousStatusLeadsCopy,
        });

        return { previousStatusLeads, previousSingleLead };
      } catch (err) {
        console.error("Error on lead update", err);
      }
    },
    onError: (err, localData, context) => {
      const { previousStatusLeads, previousSingleLead } = context;
      const { orgId, leadId } = localData;
      queryClient.setQueryData(
        ["leads", orgId, tabStatus],
        previousStatusLeads
      );
      queryClient.setQueryData(["lead", orgId, leadId], previousSingleLead);
    },
  });
  return { isLoading, mutate };
};
