import { updatePaymentPhase } from "api/paymentPhase";
import { useMutation, useQueryClient } from "react-query";
import { jsonParser } from "utils/jsonParser";

export const useUpdatePaymentPhase = () => {
  const queryClient = useQueryClient();
  return useMutation(updatePaymentPhase, {
    onMutate: (localData) => {
      try {
        const {  orgId, projectId    , index , data} = localData;
        const tempInvoice = queryClient.getQueryData([
          "paymentPhase",
          orgId,
          projectId,
        ]);
        const tempInvoiceCopy = jsonParser(tempInvoice);
        
        tempInvoiceCopy[index] = {
            ...tempInvoice[index],
            ...data
        }
        queryClient.setQueryData(["paymentPhase", orgId, projectId], tempInvoiceCopy);
        return { tempInvoiceCopy };
      } catch (error) {
        console.log(error);
      }
    },
    onError: (_, localData, context) => {
      const { orgId, projectId } = localData;
      queryClient.setQueryData(
        ["paymentPhase", orgId, projectId],
        context?.tempInvoiceCopy
      );
    },
  });
};
