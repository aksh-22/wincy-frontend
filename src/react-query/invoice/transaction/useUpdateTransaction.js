import { updateInvoiceTransaction } from "api/invoice";
import { useMutation, useQueryClient } from "react-query";
import { jsonParser } from "utils/jsonParser";

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation(updateInvoiceTransaction, {
    onMutate: (localData) => {
      try {
        const { handleClose, orgId, index, invoiceId, extraData } = localData;
        const tempTransaction = queryClient.getQueryData([
          "transaction",
          orgId,
          invoiceId,
        ]);
        const tempTransactionCopy = jsonParser(tempTransaction);
        tempTransactionCopy[index] = {
          ...tempTransactionCopy[index],
          ...extraData,
        };
        queryClient.setQueryData(
          ["transaction", orgId, invoiceId],
          tempTransactionCopy
        );
        handleClose && handleClose();
        return { tempTransaction };
      } catch (error) {
        console.error(error);
      }
    },
    onSuccess: (data, localData, context) => {
        try{
       let tempTransactionCopy =    context?.tempTransaction
       const {  orgId, index, invoiceId , refetch } = localData;

       tempTransactionCopy[index] = {
        ...tempTransactionCopy[index],
        ...data?.transaction,
      };
      queryClient.setQueryData(
        ["transaction", orgId, invoiceId],
        tempTransactionCopy
      );
      refetch && refetch()
        }catch(err){
            console.error("ERRRor" , err);
        }
    },
    onError: (_, localData, context) => {
      const { orgId, invoiceId } = localData;
      queryClient.setQueryData(
        ["transaction", orgId, invoiceId],
        context?.tempTransaction
      );
    },
  });
};
