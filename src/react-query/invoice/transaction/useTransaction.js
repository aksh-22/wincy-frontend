import { getInvoiceTransaction } from "api/invoice";
import { useQuery } from "react-query";

export const useTransaction = ({ orgId  , invoiceId}) => {
  return useQuery(["transaction", orgId , invoiceId], () => getInvoiceTransaction({ orgId , invoiceId }), {
    retry: 0,
    refetchOnWindowFocus: false,
    enabled: !!orgId && !!invoiceId,
  });
};
