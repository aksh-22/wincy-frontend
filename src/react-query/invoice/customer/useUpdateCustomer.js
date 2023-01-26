import { updateCustomer } from "api/invoice";
import { useMutation, useQueryClient } from "react-query";
import { jsonParser } from "utils/jsonParser";

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation(updateCustomer, {
    onMutate: async (localData) => {
      try {
        let { orgId, index, data } = localData;
        let previousCustomerList = queryClient.getQueryData([
          "customer",
          orgId,
        ]);
        let previousCustomerList_copy = jsonParser(previousCustomerList);
        previousCustomerList_copy[index] = {
          ...previousCustomerList_copy[index],
          ...data,
        };
        queryClient.setQueryData(
          ["customer", orgId],
          previousCustomerList_copy
        );
        return {
          previousCustomerList,
        };
      } catch (err) {}
    },

    onError: (_, localData, context) => {
      let { orgId } = localData;
      let { previousCustomerList } = context;
      queryClient.setQueryData(["customer", orgId], previousCustomerList);
    },
  });
};
