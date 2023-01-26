import { useMutation, useQueryClient } from "react-query";

import { addBug } from "api/bugs.service";
import { useSelector } from "react-redux";

export const useAddBug = (projectId, platform1, pageNo, handleClose) => {
  const queryClient = useQueryClient();
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );

  const { mutate, isLoading } = useMutation(
    (localData) => addBug(orgId, projectId, localData?.fd),
    {
      onMutate: async (localData) => {
      
        try {
          const {platform=platform1} = localData
          await queryClient.cancelQueries([
            "bugs",
            orgId,
            projectId,
            platform,
            pageNo,
          ]);
          const previousBugs = queryClient.getQueryData([
            "bugs",
            orgId,
            projectId,
            platform ?? "un-categorizes",
            pageNo,
          ]);
          
          const previousBugsCopy = JSON.parse(JSON.stringify(previousBugs))
  
          let tempObj = {};
          for (var pair of localData?.fd.entries()) {
            tempObj[pair[0]] = pair[1];
          }
  
          queryClient.setQueryData(
            ["bugs", orgId, projectId, platform ?? "un-categorizes", pageNo],
            {
              bugs: [
                {
                  ...tempObj,
                  _id: "localData",
                  assignees: [...localData?.assigneeData],
                },
                ...previousBugs?.bugs,
              ],
            }
          );
          // setShowAddMilestone(false);
          handleClose();
        return { previousBugs , previousBugsCopy };

        } catch (e) {
          console.error("error on add bug", e);
        }
      },

      onSuccess: (data, localData, context) => {
        const {platform=platform1} = localData
        queryClient.setQueryData(
          ["bugs", orgId, projectId, platform ?? "un-categorizes", pageNo],
          {
            bugs: [data?.data?.data?.bug[0], ...context?.previousBugs?.bugs],
          }
        );
        const previousBugsCount = queryClient.getQueryData([
          "bugsCount",
          orgId,
          projectId,
        ]);
        let platformName = platform === "Un-categorized" ? "UnCategorised" : platform
        if(previousBugsCount?.[platformName]){
          previousBugsCount[platformName].total = previousBugsCount?.[platformName]?.total+1
        }else{
          previousBugsCount[platformName] = {
            total : 0,
            done : 0
          }
          previousBugsCount[platformName].total = previousBugsCount?.[platformName]?.total+1
        }
        queryClient.setQueryData(
          ["bugsCount", orgId, projectId],previousBugsCount
        );
      },

      onError: (err, localData, context) => {
        const {platform=platform1} = localData
        queryClient.setQueryData([
          "bugs",
          orgId,
          projectId,
          platform ?? "un-categorizes",
          pageNo,
        ] , context?.previousBugsCopy);
      },
      onSettled: (a, milestone, context) => {
        // queryClient.invalidateQueries([
        //   "bugs",
        //   orgId,
        //   projectId,
        //   platform ?? "un-categorizes",
        //   pageNo,
        // ]);
      },
    }
  );

  return { mutate, isLoading };
};
