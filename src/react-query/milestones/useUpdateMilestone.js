import { useMutation, useQueryClient } from "react-query";

import { updateMilestone } from "api/project";

export const useUpdateMilestone = (handleRowEditing) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(updateMilestone, {
    onMutate: async (milestone) => {
      await queryClient.cancelQueries([
        "milestones",
        milestone.orgId,
        milestone.projectId,
      ]);
      const previousMilestone = queryClient.getQueryData([
        "milestones",
        milestone.orgId,
        milestone.projectId,
      ]);
      try {
        let newMilestones = previousMilestone.milestones.map((x) => {
          if (x._id === milestone.milestoneId) {
            x = {
              ...x,
              ...milestone.data
            }
            // x.title = milestone.data.title;
            // x.status = "NotStarted";
            // // x._id = 'localData';
            // x._id = milestone.milestoneId;
          }
          return x;
        });

        console.log({newMilestones})
        queryClient.setQueryData(
          ["milestones", milestone.orgId, milestone.projectId],
          { milestones: [...newMilestones] }
        );
    

        
        handleRowEditing && handleRowEditing(null, null);
      } catch (e) {
        console.log("dddd", e);
      }
      return { previousMilestone };
    },

    // onError: (err, milestone, context) => {
    //   queryClient.setQueryData('milestones', context.previousMilestone);
    // },
    onSettled: (a, milestone, context) => {
      queryClient.invalidateQueries([
        "milestones",
        context.orgId,
        context.projectId,
      ]);
    },
  });

  return { mutate, isLoading };
};
