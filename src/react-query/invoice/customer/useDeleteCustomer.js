import { deleteCustomer } from "api/invoice";
import { useMutation, useQueryClient } from "react-query";
import { jsonParser } from "utils/jsonParser";

export const useCustomerDelete = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteCustomer, {
    onMutate: async (localData) => {
      try {
        let { orgId, index } = localData;
        let previousCustomerList = queryClient.getQueryData([
          "customer",
          orgId,
        ]);
        let previousCustomerList_copy = jsonParser(previousCustomerList);
        previousCustomerList_copy?.splice(index, 1);
        queryClient.setQueryData(
          ["customer", orgId],
          previousCustomerList_copy
        );
        return {
          previousCustomerList,
        };
      } catch (err) {}
    },

    onSuccess: (data, localData, context) => {},
    onError: (_, localData, context) => {
      let { orgId } = localData;
      let { previousCustomerList } = context;
      queryClient.setQueryData(["customer", orgId], previousCustomerList);
    },
  });
};
