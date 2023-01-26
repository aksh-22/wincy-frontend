import { getNotification } from "api/notification";
import { useQuery } from "react-query";

export const useGetNotification = (params) => {
  const { orgId, status, pageNo, pageSize } = params;
  return useQuery(
    ["notification", orgId, status, pageNo, pageSize],
    () =>orgId &&  getNotification(params),
    {
      refetchOnMount: true,
      retry:0,
      keepPreviousData:true,
      enabled:!!orgId && !!status
    }
  );
};
