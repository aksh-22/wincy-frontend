import { getCustomerList } from "api/invoice";
import { useQuery } from "react-query";

export const useCustomerList = ({ orgId }) => {
  return useQuery(["customer", orgId], () => getCustomerList({ orgId }), {
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
