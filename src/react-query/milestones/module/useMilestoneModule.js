import { getMilestoneModuleList } from "api/milestone";
import { useQuery } from "react-query";
import { useSelector } from "react-redux";

export const useMilestoneModule = (pathname , milestoneId_) => {
  let milestoneId = milestoneId_??pathname?.split("/")?.[4];
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  const { isLoading, data, refetch } = useQuery(
    ["module", orgId, milestoneId],
    () => getMilestoneModuleList(orgId, milestoneId),
    {
      enabled: !!milestoneId && !!orgId,
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  return { isLoading, data, refetch };
};
