import { useMutation, useQueryClient } from "react-query";

import { assignProject } from "api/project";
// import { useHistory } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
export const useUpdateAssignees = (handleClose) => {
  const queryClient = useQueryClient();
  const {
    mutate: mutateUpdateAssignTeam,
    isLoading: isLoadingUpdateAssignTeam,
  } = useMutation(assignProject, {
    onMutate: async (localData) => {
      console.log({ localData });

      const previousData = queryClient.getQueryData([
        "projectInfo",
        localData?.orgId,
        localData?.projectId,
      ]);
      let newData = JSON.parse(JSON.stringify(previousData));
      try {
        newData.project = {
          ...newData?.project,
          projectManagers: localData?.projectHeadData,
          team: [...localData?.teamData],
        };
        queryClient.setQueryData(
          ["projectInfo", localData?.orgId, localData?.projectId],
          newData
        );
      } catch (err) {
        console.log(err);
      }
      return { previousData };
    },
    onError: (err, localData, context) => {
      console.log("err:", err);
      queryClient.setQueryData(
        ["projectInfo", localData?.orgId, localData?.projectId],
        context?.previousData
      );
    },
  });
  return {
    mutateUpdateAssignTeam,
    isLoadingUpdateAssignTeam,
  };
};
