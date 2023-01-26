import { useQuery } from "react-query";
import { getLead, getLeads } from "api/lead";

export const useGetLead = (orgId, leadId) => {
  const { isLoading, data } = useQuery(
    ["lead", orgId, leadId],
    () => getLead(orgId, leadId),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
  return { isLoading, data };
};
