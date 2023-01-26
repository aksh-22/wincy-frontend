import { updateProject } from "api/project";
import { useMutation, useQueryClient } from "react-query";

export const useUpdateProject = (setIsEdit) => {
  const queryClient = useQueryClient();
  const { mutate: mutateUpdateProject, isLoading: isLoadingUpdateProject } =
    useMutation(updateProject, {
      onMutate: (localData) => {
        const previousData = queryClient.getQueryData([
          "projectInfo",
          localData?.orgId,
          localData?.projectId,
        ]);
        let newData = JSON.parse(JSON.stringify(previousData));
        try {
          if (localData?.projectLogo) {
          } else if (localData?.paymentInfo) {
            newData.project = {
              ...newData?.project,
              paymentInfo: {
                ...(newData?.project?.paymentInfo ?? {}),
                [localData?.key]: localData?.isArray
                  ? JSON.parse(localData.formData.get(localData?.key))
                  : localData.formData.get(localData?.key),
              },
            };
          } else if (localData?.clientData) {
            newData.project = {
              ...newData?.project,
              clientData: {
                ...(newData?.project?.clientData ?? {}),
                [localData?.accessKey]: localData?.isArray
                  ? JSON.parse(localData.formData.get(localData?.key))
                  : localData.formData.get(localData?.key),
              },
            };
          } else {
            newData.project = {
              ...newData?.project,
              [localData?.key]: localData?.isArray
                ? JSON.parse(localData.formData.get(localData?.key))
                : localData.formData.get(localData?.key),
            };
          }

          queryClient.setQueryData(
            ["projectInfo", localData?.orgId, localData?.projectId],
            newData
          );
        } catch (err) {
          console.error(err);
        }
        return { previousData };
      },
      onSuccess: (data, localData, context) => {
        let newData = context?.previousData;
        newData.project.logo = data?.data?.data?.project?.logo;
        queryClient.setQueryData(
          ["projectInfo", localData?.orgId, localData?.projectId],
          data?.data?.data
        );
        // queryClient.invalidateQueries(
        //   'projectInfo',
        //   localData.orgId,
        //   localData.projectId
        // );
        // setIsEdit(false);
      },
      onError: (err, localData, context) => {
        console.log("err:", err);
        queryClient.setQueryData(
          ["projectInfo", localData?.orgId, localData?.projectId],
          context?.previousData
        );
      },
    });

  return { mutateUpdateProject, isLoadingUpdateProject };
};

// export const useUpdateProject = (handleRowEditing) => {
//   const queryClient = useQueryClient();
//   const { mutate, isLoading } = useMutation(updateProject, {
// onMutate: async (localData) => {
//     //   await queryClient.cancelQueries([
//     //     'milestones',
//     //     milestone.orgId,
//     //     milestone.projectId,
//     //   ]);
//       const previousMilestone = queryClient.getQueryData(['projectInfo', orgId, projectId],

//       );

//       try {
//         let newMilestones = previousMilestone.milestones.map((x) => {
//           if (x._id === milestone.milestoneId) {
//             x.title = milestone.data.title;
//             x.status = 'NotStarted';
//             // x._id = 'localData';
//             x._id = milestone.milestoneId;
//           }
//           return x;
//         });
//         queryClient.setQueryData(
//           ['milestones', milestone.orgId, milestone.projectId],
//           { milestones: [...newMilestones] }
//         );
//         handleRowEditing(null, null);
//       } catch (e) {
//         console.log('dddd', e);
//       }
//       return { previousMilestone };
//     },

//     onError: (err, milestone, context) => {
//       queryClient.setQueryData('milestones', context.previousMilestone);
//     },
//     onSettled: (a, milestone, context) => {
//       queryClient.invalidateQueries([
//         'milestones',
//         context.orgId,
//         context.projectId,
//       ]);
//     },
//   });

//   return { mutate, isLoading };
// };
