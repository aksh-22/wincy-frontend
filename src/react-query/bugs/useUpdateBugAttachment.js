import { bugUpdateAttachment } from "api/bugs.service";
import { useMutation, useQueryClient } from "react-query";

export const useUpdateBugAttachment = (
  orgId,
  projectId,
  platform,
  pageNo,
  bugId,
  type,
) => {
  const queryClient = useQueryClient();

  const {
    mutate: mutateUpdateBugAttachment,
    isLoading: isLoadingUpdateBugAttachment,
  } = useMutation(bugUpdateAttachment, {
    onSuccess: (data, localData, context) => {
      try {
        if (type === "mywork") {
          let previousBugs = queryClient.getQueryData([
            "myworkBugs",
            orgId,
            projectId,
            pageNo,
          ]);
          let previousBugsDeep = JSON.parse(JSON.stringify(previousBugs));
          let bool = false;
          for (let i = 0; i < previousBugsDeep?.length; i++) {
            if (String(previousBugsDeep[i]?._id) === platform) {
              for (let j = 0; j < previousBugsDeep[i]?.bugs.length; j++) {
                if (previousBugsDeep[i].bugs[j]._id === localData?.bugId) {
                  previousBugsDeep[i].bugs[j] = {
                    ...previousBugsDeep[i].bugs[j],
                    attachments: [...data?.attachments],
                  };

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
        } else {
          let previousBugs = queryClient.getQueryData([
            "bugs",
            orgId,
            projectId,
            platform,
            pageNo,
          ]);
          let newArray = [];
          previousBugs?.bugs?.map((item) => {
            if (item?._id === bugId) {
              newArray.push({
                ...item,
                attachments: [...data?.attachments],
              });
            } else {
              newArray.push(item);
            }
            return null;
          });
          previousBugs.bugs = [...newArray];
          queryClient.setQueryData(
            ["bugs", orgId, projectId, platform, pageNo],
            previousBugs
          );
        }
        localData?.handleClose && localData?.handleClose();

      } catch (err) {
        console.log(err);
      }
      localData?.emptyLocalAttachment && localData?.emptyLocalAttachment();
    },
  });

  return { mutateUpdateBugAttachment, isLoadingUpdateBugAttachment };
};
