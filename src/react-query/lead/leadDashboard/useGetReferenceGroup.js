import { useQuery } from "react-query";
import { getReferenceGroup} from "api/lead";

export const useGetReferenceGroup = (orgId  ,range) => {
  const { isLoading, data } = useQuery(
    ["getReferenceGroup", orgId , range?.startDate , range?.endDate],
    () => getReferenceGroup(orgId , range),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );
  return { isLoading, data };
};
