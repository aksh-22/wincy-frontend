import { getSingleBug } from "api/bugs.service";
import { useQuery } from "react-query";

export const useBugInfo = (orgId, projectId, bugId) => {
  const { isLoading: bugInfoLoading, data: bugInfo } = useQuery(
    ["bugInfo", orgId, projectId, bugId],
    () => getSingleBug(orgId, projectId, bugId),
    {
      enabled: !!orgId && !!projectId && !!bugId,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
  return { bugInfoLoading, bugInfo };
};
