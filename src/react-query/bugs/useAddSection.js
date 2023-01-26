import { useMutation, useQueryClient } from "react-query";

import { addSection } from "api/bugs.service";
import { useSelector } from "react-redux";

export const useAddSection = () => {
  const queryClient = useQueryClient();
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );

  const { mutate, isLoading } = useMutation(
    (localData) => addSection(localData),
    {
      onMutate: async (localData) => {
        console.log(localData);
        // console.log(orgId, projectId, platformId);
        const { orgId, projectId, platformId, data } = localData;
        const prevData = queryClient.getQueryData([
          "section",
          orgId,
          projectId,
          platformId,
        ]);

        const temp = [...prevData];

        temp.unshift(data.section);

        console.log("prevData", prevData);

        queryClient.setQueriesData(
          ["section", orgId, projectId, platformId],
          temp
        );

        // await queryClient.cancelQueries([
        //   "bugs",
        //   orgId,
        //   projectId,
        //   platform,
        //   pageNo,
        // ]);
        // const previousBugs = queryClient.getQueryData([
        //   "bugs",
        //   orgId,
        //   projectId,
        //   platform ?? "un-categorizes",
        //   pageNo,
        // ]);
        // console.log("prevBug56", previousBugs);

        // let tempObj = {};
        // for (var pair of localData.entries()) {
        //   tempObj[pair[0]] = pair[1];
        // }

        // console.log("tempObj", tempObj);
        // try {
        //   queryClient.setQueryData(
        //     ["bugs", orgId, projectId, platform ?? "un-categorizes", pageNo],
        //     {
        //       bugs: [{ ...tempObj, _id: "localData" }, ...previousBugs?.bugs],
        //     }
        //   );
        //   // setShowAddMilestone(false);
        // } catch (e) {
        //   console.log("dddd", e);
        // }
        // handleClose();
        // return { previousBugs };
      },

      onSuccess: (data, localData, context) => {
        console.log(data, { context });
        // queryClient.setQueryData(
        //   ["bugs", orgId, projectId, platform ?? "un-categorizes", pageNo],
        //   {
        //     bugs: [data?.data?.data?.bug[0], ...context?.previousBugs?.bugs],
        //   }
        // );
      },

      onError: (err, milestone, context) => {
        // queryClient.setQueryData([
        //   "bugs",
        //   orgId,
        //   projectId,
        //   platform ?? "un-categorizes",
        //   pageNo,
        // ]);
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
