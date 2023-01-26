import { useMutation, useQueryClient } from "react-query";

import { updateMilestone } from "api/project";

export const useSingleUpdateMilestone = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(updateMilestone, {
    onMutate: async (localMilestone) => {
      await queryClient.cancelQueries([
        `milestone`,
        localMilestone.orgId,
        localMilestone.projectId,
        localMilestone?.milestoneId,
      ]);

      let previousMilestone = queryClient.getQueryData([
        `milestone`,
        localMilestone.orgId,
        localMilestone.projectId,
        localMilestone?.milestoneId,
      ]);

      try {
        if (localMilestone.paymentInfo) {
          previousMilestone.milestone = {
            ...previousMilestone?.milestone,
            paymentInfo: {
              ...previousMilestone.milestone?.paymentInfo,
              ...localMilestone?.data,
            },
          };
        } else {
          previousMilestone.milestone = {
            ...previousMilestone?.milestone,
            ...localMilestone?.data,
          };
        }

        queryClient.setQueryData(
          [
            `milestone`,
            localMilestone.orgId,
            localMilestone.projectId,
            localMilestone?.milestoneId,
          ],
          previousMilestone
        );
      } catch (err) {
        console.error("catch error", err);
      }
      return { localMilestone };
    },

    onError: (err, milestone, context) => {
      queryClient.invalidateQueries([
        `milestone`,
        context.orgId,
        context.projectId,
        context?.milestoneId,
      ]);
    },
    onSettled: (a, milestone, context) => {
      context?.data?.title &&
        queryClient.invalidateQueries([
          `milestones`,
          context.orgId,
          context.projectId,
        ]);
    },
  });

  return { mutate, isLoading };
};
