import { useMutation, useQueryClient } from "react-query";

import { bugUpdate } from "api/bugs.service";
import { infoToast } from "utils/toast";

export const useUpdateTaskBug = ({
  orgId,
  projectId,
  taskId,
  //   platform = "Un-categorized",
  //   pageNo = "1",
  handleClose,
  //   setCurrentlyEditingMenu,
  //   setEditEnable,
}) => {
  const queryClient = useQueryClient();

  return useMutation(bugUpdate, {
    onMutate: async (localData) => {
      try {
        await queryClient.cancelQueries(["taskBugs", orgId, projectId, taskId]);
        const previousBugs = queryClient.getQueryData([
          "taskBugs",
          orgId,
          projectId,
          taskId,
        ]);
        const previousBugsCopy = JSON.parse(JSON.stringify(previousBugs));

        let keys = Object.keys(localData.data);
        for (let i = 0; i < previousBugs.length; i++) {
          if (previousBugs[i]._id === localData.bugId) {
            if (keys[0] === "assignees") {
              previousBugs[i].assignees = localData.additionalInfo.assignees;
            } else if (keys[0] === "comment") {
              previousBugs[i].comments = [
                localData.additionalInfo,
                ...previousBugs[i].comments,
              ];
            } else if (keys[0] === "taskId") {
              console.log("additionalInfo", localData.additionalInfo);
              previousBugs[i].task = [localData.additionalInfo];
            } else {
              // if (localData?.data?.hasOwnProperty("platform")) {
              //   spliceIndex = i;
              // }
              previousBugs[i][keys[0]] = localData.data[keys[0]];
              break;
            }
            previousBugs[i].mutate = true;
            break;
          }
        }
        //   if (localData?.data?.hasOwnProperty("platform")) {
        //     previousBugs.splice(spliceIndex, 1);
        //   }
        await queryClient.setQueryData(
          ["taskBugs", orgId, projectId, taskId],
          previousBugs
        );
        localData?.setInput && localData?.setInput("");
        //   //   setEditEnable && setEditEnable(false);

        //   //   setCurrentlyEditingMenu && setCurrentlyEditingMenu(null);
        //   if (localData?.data?.hasOwnProperty("platform")) {
        //     infoToast("Platform updated successfully!");
        //     localData?.toggle && localData?.toggle();
        //   }
        //   localData?.popUpClose && localData?.popUpClose();
        return { previousBugs, previousBugsCopy };
      } catch (err) {
        console.error("err:", err);
      }
    },

    onError: (err, milestone, context) => {
      queryClient.setQueryData(
        ["taskBugs", orgId, projectId, taskId],
        context.previousBugsCopy
      );
    },
    onSuccess: (data, localData, context) => {
      // const previousBugsCount = queryClient.getQueryData([
      //   "bugsCount",
      //   orgId,
      //   projectId,
      // ]);
      // let platformName = ''
      // //   platform === "Un-categorized" ? "UnCategorised" : platform;
      // let doneCount = 0;
      // context?.previousBugs?.bugs?.map((item) => {
      //   if (item?.status === "Done") {
      //     doneCount += 1;
      //   }
      //   return null;
      // });
      // previousBugsCount[platformName].done = doneCount;
      // queryClient.setQueriesData(
      //   ["bugsCount", orgId, projectId],
      //   previousBugsCount
      // );
    },
    onSettled: (a, as, localData) => {
      // if (localData?.data?.hasOwnProperty("platform")) {
      //   queryClient.invalidateQueries(["taskBugs", orgId, projectId, taskId]);
      // }
    },
  });
};
