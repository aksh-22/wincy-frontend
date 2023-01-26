import { bugUpdateAttachment } from "api/bugs.service";
import { useMutation, useQueryClient } from "react-query";

export const useUpdateTaskBugAttachment = ({
  orgId,
  projectId,
  bugId,
  taskId}
) => {
  const queryClient = useQueryClient();

return useMutation(bugUpdateAttachment, {
    onSuccess: (data, localData, context) => {
      try {
          let previousBugs = queryClient.getQueryData(  ["taskBugs", orgId, projectId, taskId],);
          for(let i = 0; i < previousBugs?.length; i++){
            if(previousBugs[i]._id === bugId){
              previousBugs[i].attachments = data?.attachments;
              break;
            }
          }
          queryClient.setQueryData(
            ["taskBugs", orgId, projectId, taskId],
            previousBugs
          );

          localData?.handleClose && localData?.handleClose();
        
      } catch (err) {
        console.log(err);
      }
      localData?.emptyLocalAttachment && localData?.emptyLocalAttachment();
    },
  });
};
