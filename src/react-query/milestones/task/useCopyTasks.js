import { copyTo } from "api/milestone";
import { useMutation, useQueryClient } from "react-query";

export const useCopyTasks = () => {
  const queryClient = useQueryClient();

  return useMutation(copyTo, {
    onMutate: async (localData) => {
      console.log({ localData });
      try {
      } catch (error) {}
    },
    onSuccess: async (_, localData) => {
      const { callBack, milestoneId, orgId } = localData;
      await queryClient.invalidateQueries(["tasks", orgId, milestoneId]);
      callBack && callBack();
    },
    onError: async () => {},
  });
};
