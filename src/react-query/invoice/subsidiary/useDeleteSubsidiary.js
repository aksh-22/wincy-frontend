import { deleteSubsidiary } from "api/invoice";
import { useMutation, useQueryClient } from "react-query";
import { jsonParser } from "utils/jsonParser";

export const useDeleteSubsidiary = () => {
  const queryClient = useQueryClient();

  return useMutation(deleteSubsidiary, {
    onMutate: async (localData) => {
      try {
        let { orgId , data:{subsiduaries}  , handleClose} = localData;
        let previousSubsidiaryList = queryClient.getQueryData([
          "subsidiary",
          orgId,
        ]);
        let previousSubsidiaryList_copy = jsonParser(previousSubsidiaryList);
        previousSubsidiaryList_copy =   previousSubsidiaryList_copy?.filter((item) => !subsiduaries?.includes(item?._id))
        // previousSubsidiaryList_copy?.splice(index, 1);
        queryClient.setQueryData(
          ["subsidiary", orgId],
          previousSubsidiaryList_copy
        );
        handleClose && handleClose()
        return {
          previousSubsidiaryList,
        };
      } catch (err) {}
    },

    onSuccess: (data, localData, context) => {},
    onError: (_, localData, context) => {
      let { orgId } = localData;
      let { previousSubsidiaryList } = context;
      queryClient.setQueryData(["subsidiary", orgId], previousSubsidiaryList);
    },
  });
};
