import { useQuery } from "react-query";
import { getLeads } from "api/lead";

export const useGetLeads = (orgId, status) => {
  const { isLoading, data } = useQuery(
    ["leads", orgId, status],
    () => getLeads(orgId, status),
    {
      retry: 0,
      // refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  );
  return { isLoading, data };
};
