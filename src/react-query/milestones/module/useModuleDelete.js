import { deleteModule } from "api/milestone";
import { useMutation, useQueryClient } from "react-query";
import { jsonParser } from "utils/jsonParser";
export const useModuleDelete = () => {
  const queryClient = useQueryClient();
  const { mutate: moduleDeleteMutate } = useMutation(deleteModule, {
    onMutate: (localData) => {
      try {
        const { milestoneId, orgId, data, onToggle } = localData;
        let previousModule = queryClient.getQueryData([
          "module",
          orgId,
          milestoneId,
        ]);
        let previousModuleCopy = jsonParser(previousModule);
        previousModuleCopy.modules = previousModuleCopy?.modules?.filter(
          (item) => !data?.modules?.includes(item._id)
        );
        queryClient.setQueryData(
          ["module", orgId, milestoneId],
          previousModuleCopy
        );
        onToggle && onToggle();
        return { previousModule };
      } catch (err) {
        console.error(err);
      }
    },
    onError: (error, localData, context) => {
      console.error("Error on Delete Module", error);
      const { milestoneId, orgId } = localData;
      const { previousModule } = context;
      queryClient.setQueryData(["module", orgId, milestoneId], previousModule);
    },
  });

  return { moduleDeleteMutate };
};
