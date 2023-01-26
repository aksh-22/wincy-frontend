import { createMilestoneModule } from "api/milestone";
import { useMutation, useQueryClient } from "react-query";
import { uniqueIdGenerator } from "utils/uniqueIdGenerator";

export const useAddMilestoneModule = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(createMilestoneModule, {
    onMutate: (localData) => {
      try {
        const { milestoneId, data, orgId, callBack } = localData;
        let uniqueId = uniqueIdGenerator();

        let previousModule = queryClient.getQueryData([
          "module",
          orgId,
          milestoneId,
        ]);
        let previousModuleCopy = JSON.parse(JSON.stringify(previousModule));
        let modules = previousModuleCopy?.modules;
        modules.unshift({
          module: data?.module,
          _id: uniqueId,
          disabled: true,
        });

        queryClient.setQueryData(
          ["module", orgId, milestoneId],
          previousModuleCopy
        );
        callBack && callBack();
        return { previousModuleCopy, previousModule, uniqueId };
      } catch (err) {
        console.error(err);
      }
    },
    onSuccess: (data, localData, context) => {
      console.log("success", { data }, { localData }, { context });
      try {

        const { uniqueId, previousModuleCopy } = context;
        const { milestoneId, orgId , projectId } = localData;
        let modules = previousModuleCopy?.modules;
        for (let i = 0; i < modules.length; i++) {
          if (modules[i]._id === uniqueId) {
            modules[i] = data.module;
            break;
          }
        }
        queryClient.setQueryData(
          ["module", orgId, milestoneId],
          previousModuleCopy
        );

        const previousMilestone = queryClient.getQueryData([
          "milestones",
          orgId,
          projectId,
        ]);
        let milestone = previousMilestone?.milestones;
        for (let i = 0; i < milestone?.length; i++) {
          if (milestone[i]._id === milestoneId) {
            if(milestone[i].moduleCount){
              milestone[i].moduleCount +=1 
            }else{
              milestone[i].moduleCount = 1
            }
            break;
          }
        }
        queryClient.setQueriesData(
          ["milestones", orgId, projectId],
          previousMilestone
        );
        console.log("previousMilestone ->" , previousMilestone)
      } catch (err) {
        console.error("Error on Success Module Create", err);
      }
    },
    onError: (error, localData, context) => {
      const {  previousModule } = context;
      const { milestoneId, orgId } = localData;
      queryClient.setQueryData(
        ["module", orgId, milestoneId],
        previousModule
      );
      console.error("Error on Add Module", error);
    },
  });

  return { mutate, isLoading };
};
