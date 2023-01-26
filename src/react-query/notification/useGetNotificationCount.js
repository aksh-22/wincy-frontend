import { getNotificationCount } from "api/notification";
import { useQuery } from "react-query";

export const useGetNotificationCount = ({ orgId }) => {
  const { isLoading, isError, data  ,refetch} = useQuery(
    ["notification_count"],
    () => getNotificationCount({ orgId }),
    {
      refetchOnMount: true,
      retry: 0,
      keepPreviousData: true,
      enabled : !!orgId
    }
  );
  return { isError, isLoading, data , refetch };
};
