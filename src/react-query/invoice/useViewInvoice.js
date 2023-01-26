import { getInvoice, viewInvoice } from "api/invoice";
import { useQuery } from "react-query";

export const useViewInvoice = ({ orgId , invoiceId   }) => {
  return useQuery(["invoiceView", orgId , invoiceId ], () => viewInvoice({ orgId  , invoiceId }), {
    retry: 0,
    refetchOnWindowFocus: false,
    enabled: !!orgId,
  });
};
