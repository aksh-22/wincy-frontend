import { useMutation, useQueryClient } from "react-query";

import { bugUpdate } from "api/bugs.service";
import { infoToast } from "utils/toast";

export const useUpdateBug = (
  orgId,
  projectId,
  platform = "Un-categorized",
  pageNo = "1",
  handleClose,
  setCurrentlyEditingMenu,
  setEditEnable
) => {
  const queryClient = useQueryClient();

  const { mutate: mutateUpdateBug, isLoading: isLoadingUpdateBug } =
    useMutation(bugUpdate, {
      onMutate: async (localData) => {
        try {
          await queryClient.cancelQueries([
            "bugs",
            orgId,
            projectId,
            platform === undefined ? "Un-categorized" : platform,
            pageNo ?? 1,
          ]);
          const previousBugs = queryClient.getQueryData([
            "bugs",
            orgId,
            projectId,
            platform === undefined ? "Un-categorized" : platform,
            pageNo ?? 1,
          ]);

          const previousBugsCopy = JSON.parse(JSON.stringify(previousBugs));

          let keys = Object.keys(localData.data);
          let spliceIndex = 0;
          // if (keys[0] !== "comment") {
          for (let i = 0; i < previousBugs.bugs.length; i++) {
            if (previousBugs.bugs[i]._id === localData.bugId) {
              if (keys[0] === "assignees") {
                previousBugs.bugs[i].assignees =
                  localData.additionalInfo.assignees;
              } else if (keys[0] === "comment") {
                previousBugs.bugs[i].comments = [
                  localData.additionalInfo,
                  ...previousBugs.bugs[i].comments,
                ];
              } else if (keys[0] === "taskId") {
                previousBugs.bugs[i].task = [localData.additionalInfo];
              } else {
                if (localData?.data?.hasOwnProperty("platform")) {
                  spliceIndex = i;
                }
                previousBugs.bugs[i][keys[0]] = localData.data[keys[0]];
                break;
              }
              previousBugs.bugs[i].mutate = true;
              break;
            }
          }
          if (localData?.data?.hasOwnProperty("platform")) {
            previousBugs.bugs.splice(spliceIndex, 1);
          }
          await queryClient.setQueryData(
            ["bugs", orgId, projectId, platform, pageNo],
            previousBugs
          );
          handleClose && handleClose("");
          setEditEnable && setEditEnable(false);

          setCurrentlyEditingMenu && setCurrentlyEditingMenu(null);
          if (localData?.data?.hasOwnProperty("platform")) {
            infoToast("Platform updated successfully!");
            localData?.toggle && localData?.toggle();
          }
          localData?.popUpClose && localData?.popUpClose();
          return { previousBugs, previousBugsCopy };
        } catch (err) {
          console.error("err:", err);
        }
      },

      onError: (err, milestone, context) => {
        queryClient.setQueryData(
          ["bugs", orgId, projectId, platform, pageNo],
          context.previousBugsCopy
        );
      },
      onSuccess: (data, localData, context) => {
        const previousBugsCount = queryClient.getQueryData([
          "bugsCount",
          orgId,
          projectId,
        ]);
        let platformName =
          platform === "Un-categorized" ? "UnCategorised" : platform;
        let doneCount = 0;
        context?.previousBugs?.bugs?.map((item) => {
          if (item?.status === "Done") {
            doneCount += 1;
          }
          return null;
        });
        previousBugsCount[platformName].done = doneCount;
        queryClient.setQueriesData(
          ["bugsCount", orgId, projectId],
          previousBugsCount
        );
      },
      onSettled: (a, as, localData) => {

        if (localData?.data?.hasOwnProperty("platform")) {
          queryClient.invalidateQueries([
            "bugs",
            orgId,
            projectId,
            localData?.data?.platform,
            pageNo,
          ]);
        }
      },
    });

  return { mutateUpdateBug, isLoadingUpdateBug };
};
