import { updateProjectAttachment } from "api/project";
import { useMutation, useQueryClient } from "react-query";
export const useUpdateProjectAttachment = (handleClose) => {
  const queryClient = useQueryClient();
  const { mutate: mutateUpdateAttachment, isLoading: isLoadingUpdate } =
    useMutation(updateProjectAttachment, {
      onMutate: async (localData) => {
        const { orgId, projectId } = localData;
        const previousData = queryClient.getQueryData([
          "projectAttachment",
          orgId,
          projectId,
        ]);
        let newData = JSON.parse(JSON.stringify(previousData));

        try {
          const { folderName, attachmentId, isFolderEdit } = localData;
          const attachments = [...newData?.attachments];
          for (let i = 0; i < attachments?.length; i++) {
            if (attachments[i]?._id?.folder === folderName) {
              for (let j = 0; j < attachments[i]?.attachments?.length; j++) {
                if (attachments[i]?.attachments[j]?._id === attachmentId) {
                  for (const property in localData?.data) {
                    attachments[i].attachments[j][property] =
                      localData?.data[property];
                    if (isFolderEdit) {
                      attachments[i].attachments[j].folder =
                        localData?.data?.name;
                    }
                  }
                  break;
                }
              }
              if (isFolderEdit) {
                attachments[i]._id.folder = localData?.data?.name;
              }
              break;
            }
          }

          if (isFolderEdit) {
            queryClient.setQueryData(
              ["projectAttachment", orgId, projectId],
              newData
            );
          }
        } catch (err) {
          console.error(err);
        }
        return { previousData, newData };
      },
      onSuccess: (data, localData, context) => {
        const { orgId, projectId, isFileEdit } = localData;
        if (isFileEdit) {
          queryClient.setQueryData(
            ["projectAttachment", orgId, projectId],
            context.newData
          );
        }
        localData?.handleClose && localData?.handleClose();
      },
      onError: (err, localData, context) => {
        const { orgId, projectId } = localData;
        queryClient.setQueryData(
          ["projectAttachment", orgId, projectId],
          context.previousData
        );
      },
    });
  return {
    mutateUpdateAttachment,
    isLoadingUpdate,
  };
};
