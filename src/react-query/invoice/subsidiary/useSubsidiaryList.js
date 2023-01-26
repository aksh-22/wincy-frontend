import { getSubsidiaries } from "api/invoice";
import { useQuery } from "react-query";

export const useSubsidiaryList = ({ orgId }) => {
  return useQuery(["subsidiary", orgId], () => getSubsidiaries({ orgId }), {
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
