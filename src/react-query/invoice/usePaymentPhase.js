import { getPaymentPhase } from "api/paymentPhase";
import { useQuery } from "react-query";

export const usePaymentPhase = ({ orgId , projectId }) => {
  return useQuery(["paymentPhase", orgId , projectId], () => getPaymentPhase({ orgId , projectId}), {
    retry: 0,
    refetchOnWindowFocus: false,
    enabled : !!projectId && !!orgId
  });
};
