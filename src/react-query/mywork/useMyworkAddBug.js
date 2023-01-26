import { useMutation, useQueryClient } from "react-query";

import { addBug } from "api/bugs.service";
import { useSelector } from "react-redux";

export const useMyworkAddBug = (projectId, platform, pageNo, handleClose) => {
  const queryClient = useQueryClient();
  const orgId = useSelector(
    (state) => state.userReducer?.selectedOrganisation?._id
  );
  // console.log("platform:", platform);

  // console.log("useMyworkAddBug platform:", platform);

  const { mutate, isLoading } = useMutation(
    (localData) => addBug(orgId, projectId, localData),
    {
      onMutate: async (localData) => {
        // console.log("localData:", localData);
        // console.log("platform:", platform);

        // console.log("prevBug ids", orgId, projectId, pageNo);
        let previousBugs;
        let previousBugsDeep;
        await queryClient.cancelQueries([
          "myworkBugs",
          orgId,
          projectId,
          pageNo,
        ]);

        try {
          previousBugs = queryClient.getQueryData([
            "myworkBugs",
            orgId,
            projectId,
            pageNo,
          ]);
          previousBugsDeep = JSON.parse(JSON.stringify(previousBugs));

          let tempObj = {
            updationKey: "localData",
          };
          for (var pair of localData.entries()) {
            tempObj[pair[0]] = pair[1];
          }

          let platformLocal = [];
          for (let i = 0; i < previousBugsDeep.length; i++) {
            platformLocal.push(previousBugsDeep[i]._id);
          }
          console.log("platformLocal:", platformLocal);
          if (platformLocal.includes(platform)) {
            // console.log("platform includes true");
          } else {
            // console.log("platform X not includes");
            previousBugsDeep.push({
              _id: platform,
              bugs: [],
            });
          }

          for (let i = 0; i < previousBugsDeep.length; i++) {
            if (String(previousBugsDeep[i]._id) === platform) {
              // console.log("for platform matched");
              previousBugsDeep[i]?.bugs.unshift(tempObj);

              queryClient.setQueryData(
                ["myworkBugs", orgId, projectId, pageNo],
                previousBugsDeep
              );
              // console.log("previousBugsDeep:", previousBugsDeep);

              break;
            }
          }
        } catch (err) {
          console.log("err", err);
        }

        handleClose();
        return { previousBugs };
      },

      onSuccess: (data) => {
        console.log("onSuccess data:", data);
        let previousBugs = queryClient.getQueryData([
          "myworkBugs",
          orgId,
          projectId,
          pageNo,
        ]);
        let previousBugsDeep = JSON.parse(JSON.stringify(previousBugs));

        try {
          for (let i = 0; i < previousBugsDeep.length; i++) {
            // console.log("i:", i, "platform:", platform);
            if (String(previousBugsDeep[i]._id) === platform) {
              // console.log("platform matched ");
              for (let j = 0; j < previousBugsDeep[i]?.bugs?.length; j++) {
                if (previousBugsDeep[i]?.bugs[j].updationKey === "localData") {
                  previousBugsDeep[i].bugs[j] = data.data.data.bug[0];

                  queryClient.setQueryData(
                    ["myworkBugs", orgId, projectId, pageNo],
                    previousBugsDeep
                  );

                  break;
                }
              }
            }
          }
        } catch (err) {}
      },
      onError: async (err, localData, context) => {
        // await queryClient.invalidateQueries([
        //   "myworkBugs",
        //   orgId,
        //   projectId,
        //   pageNo,
        // ]);
        // console.log("onError context:", context);

        queryClient.setQueryData(
          ["myworkBugs", orgId, projectId, pageNo],
          context.previousBugs
        );
      },
    }
  );

  return { mutate, isLoading };
};
