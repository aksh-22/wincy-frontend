import { deletePaymentPhase } from "api/paymentPhase";
import { useMutation, useQueryClient } from "react-query";
import { jsonParser } from "utils/jsonParser";

export const useDeletePaymentPhase = () => {
  const queryClient = useQueryClient();
  return useMutation(deletePaymentPhase, {
    onMutate: (localData) => {
      try {
        const { handleClose, orgId, projectId , paymentPhaseId } = localData;
        const tempInvoice = queryClient.getQueryData([
          "paymentPhase",
          orgId,
          projectId,
        ]);
        const tempInvoiceCopy = jsonParser(tempInvoice);
        const temp = tempInvoice.filter((el) => el?._id !== paymentPhaseId);
        queryClient.setQueryData(["paymentPhase", orgId, projectId], temp);
        handleClose && handleClose();
        return { tempInvoiceCopy };
      } catch (error) {
        console.log(error);
      }
      // queryClient.setQueryData(["lead", orgId, leadId], data);
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
