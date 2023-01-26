import { updateMilestoneModule } from "api/milestone";
import { useMutation, useQueryClient } from "react-query";
import { useSelector } from "react-redux";

export const useMilestoneModuleUpdate = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(updateMilestoneModule, {
    onMutate: (localData) => {
      try {
        const { milestoneId, moduleId, data, orgId } = localData;
        let previousModule = queryClient.getQueryData([
          "module",
          orgId,
          milestoneId,
        ]);
        let previousModuleCopy = JSON.parse(JSON.stringify(previousModule));
        let modules = previousModuleCopy?.modules;
        for (let i = 0; i < modules.length; i++) {
          if (modules[i]._id === moduleId) {
            modules[i].module = data?.module;
            break;
          }
        }
        queryClient.setQueryData(
          ["module", orgId, milestoneId],
          previousModuleCopy
        );
      } catch (err) {
        console.error(err);
      }
    },
    onError: (error, localData, context) => {
      console.error(error);
      const { milestoneId, orgId } = localData;
      queryClient.setQueryData(
        ["module", orgId, milestoneId],
        context?.previousModule
      );
    },
  });
  return { mutate, isLoading };
};
