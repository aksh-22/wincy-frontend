import { getBugActivity } from "api/bugs.service";
import { useQuery } from "react-query";

export const useBugActivity = (orgId, type, bugId) => {
  const { isLoading: bugActivityLoading, data: bugActivity  , refetch } = useQuery(
    ["bugActivity", orgId, type, bugId],
    () => getBugActivity(orgId, type, bugId),
    {
      enabled: !!orgId && !!type && !!bugId,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
  return { bugActivityLoading, bugActivity   , refetch};
};
