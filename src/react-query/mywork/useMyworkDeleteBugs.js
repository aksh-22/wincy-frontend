import { useMutation, useQueryClient } from "react-query";

import { bugDelete } from "api/bugs.service";
import { useSelector } from "react-redux";
//mutate keys platform,orgId,projectId,data:{bugs:checkedBugs}
export const useMyworkDeleteBugs = ( orgId,
  projectId) => {
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteBug, isLoading: isDeleteBugLoading } =
    useMutation(bugDelete, {
      onMutate: (localData) => {
        console.log("localData:", localData);
        console.log("localData bugs array:", localData);

        let previousBugs = queryClient.getQueryData([
          "myworkBugs",
          orgId,
          projectId,
          1,
        ]);
console.log(previousBugs)
        let previousBugsDeepCopy = JSON.parse(JSON.stringify(previousBugs));
        let updatedBugs;
        let platformIndex;
        try {
          for (let i = 0; i < previousBugsDeepCopy?.length; i++) {
            if (previousBugsDeepCopy[i]._id === localData?.platform) {
              platformIndex = i;
              updatedBugs = previousBugsDeepCopy[i]?.bugs?.filter(
                (row) => !localData?.data?.bugs?.includes(row?._id)
              );

              previousBugsDeepCopy[i].bugs = updatedBugs;

              queryClient.setQueryData(
                ["myworkBugs", localData?.orgId, localData?.projectId, 1],
                previousBugsDeepCopy
              );
              localData.handleClose();
              localData.onToggle();
              break;
            }
          }
        } catch (err) {
          console.log("err:", err);
        }
        // console.log("previousBugs:", previousBugs);
        return {
          previousBugs,
        };
      },
      onSuccess: (data, localData, context) => {
        console.log("data:", data);
      },
      onError: (err, localData, context) => {
        console.log("err:", err);

        queryClient.setQueryData(
          ["myworkBugs", localData?.orgId, localData?.projectId, 1],
          context.previousBugs
        );
      },
    });

  return { mutateDeleteBug, isDeleteBugLoading };
};
