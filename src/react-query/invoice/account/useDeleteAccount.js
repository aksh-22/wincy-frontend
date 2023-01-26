import { deleteAccount } from "api/invoice";
import { deleteLead } from "api/lead";
import { useMutation, useQueryClient } from "react-query";
import { jsonParser } from "utils/jsonParser";

export const useDeleteAccount = (orgId) => {
  const queryClient = useQueryClient();
  return useMutation(deleteAccount, {
    onMutate: (localData) => {
        try {
            const {data:{accountIds} , handleClose} = localData
            const tempAccount = queryClient.getQueryData(["account", orgId , null]);
            const tempAccountCopy = jsonParser(tempAccount)
        const temp = tempAccount.filter((el) => !accountIds?.includes(el._id));
        queryClient.setQueryData(["account", orgId , null], temp);
        handleClose && handleClose()
        return {tempAccountCopy}
      } catch (error) {
        console.log(error);
      }
      // queryClient.setQueryData(["lead", orgId, leadId], data);
    },
    onError:(_,__,context) => {
        queryClient.setQueryData(["account", orgId , null], context?.tempAccountCopy);
    }
  });
};
