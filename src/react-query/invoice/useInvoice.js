import { getInvoice } from "api/invoice";
import { useQuery } from "react-query";

export const useInvoice = ({ orgId , financialYear , subsiduary  }) => {
  return useQuery(["invoice", orgId  , financialYear , subsiduary], () => getInvoice({ orgId , financialYear , subsiduary  }), {
    retry: 0,
    refetchOnWindowFocus: false,
    enabled: !!orgId,
    keepPreviousData:true
  });
};
