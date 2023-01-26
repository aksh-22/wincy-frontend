import { useMutation, useQueryClient } from "react-query";
import { bugUpdate } from "api/bugs.service";
import { CasinoSharp } from "@material-ui/icons";

export const useMyworkUpdateBug = (
  orgId,
  projectId,
  pageNo,
  handleClose,
  platform
) => {
  const queryClient = useQueryClient();
  const { isLoading: isLoadingMyworkUpdateBug, mutate: mutateMyworkUpdateBug } =
    useMutation(bugUpdate, {
      onMutate: async (localData) => {
        console.log("localData:", localData);
        let previousBugs;
        let previousBugsDeep;
        let bugInfo;
        try {
          // console.log("orgId,projectId,pageNo  :", orgId, projectId, pageNo);
          previousBugs = queryClient.getQueryData([
            "myworkBugs",
            orgId,
            projectId,
            pageNo,
          ]);

          // console.log("previousBugs:", previousBugs);

          previousBugsDeep = JSON.parse(JSON.stringify(previousBugs));
          // console.log("platform:", platform);
          let bool = false;
          for (let i = 0; i < previousBugsDeep?.length; i++) {
            console.log("i:", i);
            console.log("platform:",platform ,  platform?.id ===String(previousBugsDeep[i]?._id === null ? "Uncategorized" : previousBugsDeep[i]?._id));
            if (String(previousBugsDeep[i]?._id === null ? "Uncategorized" : previousBugsDeep[i]?._id) === platform?.id) {
              // console.log("platform matched");
              for (let j = 0; j < previousBugsDeep[i]?.bugs.length; j++) {
                if (previousBugsDeep[i]?.bugs[j]._id === localData?.bugId) {
                  // console.log("bugId matched");
                  // get the key and value that need to be updated
                  let key = Object.keys(localData?.data);
                  if (key[0] === "assignee") {
                    // console.log("in if assignee");
                    previousBugsDeep[i].bugs[j][key[0]][0] =
                      localData?.additionalInfo[key[0]];

                    // console.log(
                    //   "previousBugsDeep[i].bugs[j]:",
                    //   previousBugsDeep[i].bugs[j]
                    // );
                    // previousBugsDeep[i].bugs[j].updationKey = localData?.bugId;
                  } else {
                    previousBugsDeep[i].bugs[j][key[0]] =
                      localData?.data[key[0]];
                    // previousBugsDeep[i].bugs[j].updationKey = localData?.bugId;
                  }
                  // currentBug = previousBugsDeep[i].bugs[j];
                  // console.log(
                  //   "mutate previousBugsDeep[i].bugs[j]:",
                  //   previousBugsDeep[i].bugs[j]
                  // );
                  bool = true;

                  queryClient.setQueryData(
                    ["myworkBugs", orgId, projectId, pageNo],
                    previousBugsDeep
                  );
                  // console.log("previousBugsDeep:", previousBugsDeep);

                  break;
                }
              }
              // break;
            }
            if (bool) {
              break;
            }
          }
        } catch (err) {
          console.log("err:", err);
        }

        handleClose && handleClose();
        return { previousBugs };
      },

      onSuccess: (data, localData, context) => {
        console.log("onSuccess data:", data);
        // console.log("localData:", localData);
        // console.log("context:", context);
        // queryClient.setQueryData(
        //   ["myworkBugs", orgId, projectId, pageNo],null
        // );
        let previousBugsDeep = JSON.parse(JSON.stringify(context.previousBugs));
        let bool = false;
        for (let i = 0; i < previousBugsDeep?.length; i++) {
          if (String(previousBugsDeep[i]?._id) === platform) {
            for (let j = 0; j < previousBugsDeep[i]?.bugs.length; j++) {
              if (previousBugsDeep[i].bugs[j]._id === localData?.bugId) {
                previousBugsDeep[i].bugs[j] = data.bug[0];
                console.log(
                  "previousBugsDeep[i]?.bugs[j]:",
                  previousBugsDeep[i]?.bugs[j]
                );
                bool = true;
                queryClient.setQueryData(
                  ["myworkBugs", orgId, projectId, pageNo],
                  previousBugsDeep
                );
                break;
              }
            }
          }
          if (bool) {
            break;
          }
        }
      },
      onError: (err, localData, context) => {
        console.log("err:", err);
        queryClient.setQueryData(
          ["myworkBugs", orgId, projectId, pageNo],
          context.previousBugs
        );
      },
    });

  return { isLoadingMyworkUpdateBug, mutateMyworkUpdateBug };
};
