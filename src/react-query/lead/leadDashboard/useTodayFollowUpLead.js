import { useQuery } from "react-query";
import { todayFollowUpLead} from "api/lead";

export const useTodayFollowUpLead = (orgId) => {
  const { isLoading, data } = useQuery(
    ["todayFollowUpLead", orgId],
    () => todayFollowUpLead(orgId),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
  return { isLoading, data };
};
