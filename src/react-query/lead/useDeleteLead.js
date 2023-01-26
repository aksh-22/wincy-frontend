import { useQueryClient, useMutation, useQuery } from "react-query";
import { deleteLead } from "api/lead";

export const useDeleteLead = (orgId, leadId, status) => {
  const queryClient = useQueryClient();
  const { isLoading, mutate } = useMutation(deleteLead, {
    onSuccess: ({ data }) => {
      const leads = queryClient.getQueryData(["leads", orgId, status]);
      try {
        const index = leads.data.leads.findIndex((el) => el._id === leadId);
        leads.data.leads.splice(index, 1);
        queryClient.setQueryData(["leads", orgId, status], leads);
      } catch (error) {
        console.log(error);
      }
      // queryClient.setQueryData(["lead", orgId, leadId], data);
    },
  });
  return { isLoading, mutate };
};
