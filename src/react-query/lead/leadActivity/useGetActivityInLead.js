import { useQuery } from "react-query";
import { getActivityInLead } from "api/lead";

export const useGetActivityInLead = (orgId, leadId) => {
  const { isLoading, data } = useQuery(
    ["leadActivity", orgId, leadId],
    () => getActivityInLead(orgId, leadId),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
  return { isLoading, data };
};
