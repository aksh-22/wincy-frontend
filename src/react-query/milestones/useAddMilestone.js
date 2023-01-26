import { useMutation, useQueryClient } from "react-query";

import { addMilestoneApi } from "api/project";
import { uniqueIdGenerator } from "utils/uniqueIdGenerator";

export const useAddMilestone = (handleClose) => {
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(addMilestoneApi, {
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
        const previousMilestoneCopy = JSON.parse(
          JSON.stringify(previousMilestone)
        );
        let uniqueId = uniqueIdGenerator();
        if(milestone?.view){
          previousMilestone.milestones = [
            ...previousMilestone?.milestones,
            {
              status: "NotStarted",
              _id: uniqueId,
              title: milestone.data.title,
              disabled: true,
            },
          ];
        }else{
          previousMilestone.milestones = [
            {
              status: "NotStarted",
              _id: uniqueId,
              title: milestone.data.title,
              disabled: true,
            },
            ...previousMilestone?.milestones,
          ];
        }
      
        queryClient.setQueryData(
          ["milestones", milestone.orgId, milestone.projectId],
          previousMilestone
        );
        // setShowAddMilestone(false);

        // TODO: Project Milestone Count Update
        const previousProject = queryClient.getQueryData([
          "projectInfo",
          milestone.orgId,
          milestone.projectId,
        ]);
        milestone?.buttonType === "save&close" && handleClose();
        const previousProjectCopy = JSON.parse(JSON.stringify(previousProject));

        let milestoneCount = previousProjectCopy?.project?.milestoneCount??{};
        milestoneCount.NotStarted = (milestoneCount?.NotStarted ?? 0) + 1;
        previousProjectCopy.project.milestoneCount = milestoneCount 
        queryClient.setQueriesData(
          ["projectInfo", milestone.orgId, milestone.projectId],
          previousProjectCopy
        );
        return {
          previousMilestone,
          uniqueId,
          previousMilestoneCopy,
          previousProject,
        };
      } catch (e) {
        console.error("On Add Milestone Mutate", e);
      }
    },
    onSuccess: (data, localData, context) => {
      try {
        const { previousMilestone, uniqueId } = context;
        const { orgId, projectId } = localData;
        let milestone = previousMilestone?.milestones;
        for (let i = 0; i < milestone?.length; i++) {
          if (milestone[i]._id === uniqueId) {
            milestone[i] = { ...data?.milestone };
            break;
          }
        }
        queryClient.setQueriesData(
          ["milestones", orgId, projectId],
          previousMilestone
        );
      } catch (err) {
        console.error("on Add Milestone", err);
      }
    },
    onError: (err, localData, context) => {
      const { orgId, projectId } = localData;
      queryClient.setQueryData(
        ["milestones", orgId, projectId],
        context.previousMilestoneCopy
      );
      queryClient.setQueryData(
        ["projectInfo", orgId, projectId],
        context.previousProject
      );
    },
    // onSettled: (a, milestone, context) => {
    //   queryClient.invalidateQueries([
    //     'milestones',
    //     context.orgId,
    //     context.projectId,
    //   ]);
    // },
  });

  return { mutate, isLoading };
};
