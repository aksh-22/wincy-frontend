import { getAccount } from "api/invoice";
import { useQuery } from "react-query";

export const useAccount = ({ orgId , subsidiaryId }) => {
  return useQuery(["account", orgId , subsidiaryId], () => getAccount({ orgId , subsidiaryId }), {
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
