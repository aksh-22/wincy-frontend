import { getQueries } from "api/query";
import { useQuery } from "react-query";

export const useGetQueries = (orgId, projectId , queryStatus) => {
  const { isLoading, data , isError } = useQuery(
    ["queries", orgId, projectId , queryStatus],
    () => getQueries(orgId, projectId , queryStatus),
    {
      enabled: !!orgId,
      retry: 0,
    }
  );
  return { isLoading, data , isError };
};
