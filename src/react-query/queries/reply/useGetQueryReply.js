import { getQueryReply } from "api/query";
import { useQuery } from "react-query";

export const useGetQueryReply = (orgId, projectId , queryId) => {
  const { isLoading, data , isError } = useQuery(
    ["queries_reply", orgId, projectId , queryId],
    () => getQueryReply(orgId, projectId , queryId),
    {
      enabled: !!orgId,
      retry: 0,
    }
  );
  return { isLoading, data , isError };
};
